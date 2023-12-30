import { Module } from '@nestjs/common';
import { uploadController } from './upload.controller';
import { s3Provider } from '../providers/s3.provider';
import { UploadService } from './upload.service';

@Module({
  controllers: [uploadController],
  providers: [s3Provider , UploadService],
})
export class UploadModule {}
