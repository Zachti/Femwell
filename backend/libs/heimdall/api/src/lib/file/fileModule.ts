import { Module } from '@nestjs/common';
import { fileController } from './fileController';
import { FileService } from './file.service';

@Module({
  controllers: [fileController],
  providers: [FileService],
})
export class FileModule {}
