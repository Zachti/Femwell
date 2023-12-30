import {
  Controller,
  MaxFileSizeValidator,
  NestInterceptor,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { mimeTypePipe } from '../pipes/mimeType.pipe';
import { Roles, Role } from '@backend/infrastructure';
import {Multer} from 'Multer'

@Controller('upload')
export class uploadController {
  constructor(private readonly uploadService: UploadService) {
  }
  @Post()
  @Roles([Role.User , Role.Padulla , Role.Premium])
  @UseInterceptors(FileInterceptor('file')as unknown as NestInterceptor)
  @UsePipes(new mimeTypePipe())
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({maxSize: Number(process.env['MAX_FILE_SIZE'] as string)}) ,
    ] })) file: Express.Multer.File) {
    return await this.uploadService.upload({key: file.originalname , data: file.buffer , mimeType:file.mimetype})
  }
}
