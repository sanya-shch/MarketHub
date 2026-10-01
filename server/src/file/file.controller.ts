import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
      fileFilter: (_req, file, cb) =>
        file.mimetype.startsWith('image/')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
    }),
  )
  @Auth()
  @Post()
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    return this.fileService.saveFiles(files, folder);
  }
}
