import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { path as rootPath } from 'app-root-path';
import { randomUUID } from 'crypto';
import { ensureDir, remove, writeFile } from 'fs-extra';
import { join } from 'path';
import { PrismaService } from 'src/prisma.service';
import { FileResponse } from './file.interface';

// `folder` goes into a file-system path, so it is an allow-list, never raw input
const ALLOWED_FOLDERS = new Set(['products']);

// Content is checked by magic bytes: the client-supplied mimetype / file name
// are not trustworthy. SVG is intentionally not allowed (it can carry scripts).
const IMAGE_SIGNATURES: { ext: string; match: (b: Buffer) => boolean }[] = [
  { ext: 'jpg', match: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: 'png',
    match: b =>
      b
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    ext: 'gif',
    match: b =>
      ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString('latin1')),
  },
  {
    ext: 'webp',
    match: b =>
      b.subarray(0, 4).toString('latin1') === 'RIFF' &&
      b.subarray(8, 12).toString('latin1') === 'WEBP',
  },
];

// the only shape of path this service ever hands out (see saveFiles)
const UPLOADED_PATH =
  /^\/uploads\/([a-z]+)\/[0-9a-f-]{36}\.(jpg|png|gif|webp)$/;

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private prisma: PrismaService) {}

  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    if (!ALLOWED_FOLDERS.has(folder)) {
      throw new BadRequestException('Unknown upload folder');
    }

    if (!files?.length) throw new BadRequestException('No files uploaded');

    // validate everything first, write only if all files are fine
    const checked = files.map(file => {
      const type = IMAGE_SIGNATURES.find(signature =>
        signature.match(file.buffer),
      );

      if (!type)
        throw new BadRequestException(
          'Only JPEG, PNG, GIF and WebP images are allowed',
        );

      return { file, ext: type.ext };
    });

    const uploadedFolder = join(rootPath, 'uploads', folder);

    await ensureDir(uploadedFolder);

    const response: FileResponse[] = await Promise.all(
      checked.map(async ({ file, ext }) => {
        // server-generated name: the original name is never used in a path
        const name = `${randomUUID()}.${ext}`;

        await writeFile(join(uploadedFolder, name), file.buffer);

        return {
          url: `/uploads/${folder}/${name}`,
          name,
        };
      }),
    );

    return response;
  }

  /**
   * Deletes uploaded images that no product uses anymore. Never throws: a file
   * that cannot be removed must not fail the request that triggered the cleanup.
   */
  async deleteUnusedImages(urls: string[]) {
    for (const url of new Set(urls)) {
      const match = UPLOADED_PATH.exec(url);

      if (!match || !ALLOWED_FOLDERS.has(match[1])) continue;

      try {
        // another product may reference the same file: keep it then
        const stillUsed = await this.prisma.product.count({
          where: { images: { has: url } },
        });

        if (stillUsed) continue;

        await remove(join(rootPath, url));
      } catch (error) {
        this.logger.warn(`Could not delete ${url}: ${String(error)}`);
      }
    }
  }
}
