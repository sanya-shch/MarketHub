import { BadRequestException, Injectable } from '@nestjs/common';
import { path as rootPath } from 'app-root-path';
import { randomUUID } from 'crypto';
import { ensureDir, writeFile } from 'fs-extra';
import { join } from 'path';
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

@Injectable()
export class FileService {
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
}
