import {
  Controller, Inject,
  MaxFileSizeValidator,
  NestInterceptor,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors, UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { mimeTypePipe } from '../pipes/mimeType.pipe';
import { uploadConfig } from '@backend/heimdall';
import { ConfigType } from '@nestjs/config';

@Controller('upload')
export class uploadController {
  constructor(private readonly uploadService: UploadService,
              @Inject(uploadConfig.KEY)
  private readonly uploadCfg: ConfigType<typeof uploadConfig>) {
  }
  @Post()
  @UseInterceptors(FileInterceptor('file') as NestInterceptor)
  @UsePipes(new mimeTypePipe())
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({maxSize: Number(this.uploadCfg.maxFileSize)}) ,
    ] })) file:Express.Multer.File) {
    return await this.uploadService.upload({key: file.originalname , data: file.buffer , mimeType:file.mimetype})
  }
}
