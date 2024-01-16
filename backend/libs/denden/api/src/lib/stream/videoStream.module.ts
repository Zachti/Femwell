import { Module } from '@nestjs/common';
import { VideoStreamService } from './videoStream.service';
import { VideoStreamController } from './videoStream.controller';

@Module({
  controllers: [VideoStreamController],
  providers: [VideoStreamService],
  exports: [],
})
export class VideoStreamModule {}
