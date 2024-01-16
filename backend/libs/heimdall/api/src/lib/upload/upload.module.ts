import { Module } from '@nestjs/common';
import { uploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [uploadController],
  providers: [UploadService],
})
export class UploadModule {}
