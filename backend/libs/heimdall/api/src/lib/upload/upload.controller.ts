import {
  Controller,
  MaxFileSizeValidator,
  NestInterceptor,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class uploadController {
  constructor(private readonly uploadService: UploadService) {
  }
  @Post()
  @UseInterceptors(FileInterceptor('file') as NestInterceptor)
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({maxSize: 1500}) ,
    ] })) file:Express.Multer.File) {
    return await this.uploadService.upload({key: file.originalname , data: file.buffer , mimeType:file.mimetype})
  }
}
