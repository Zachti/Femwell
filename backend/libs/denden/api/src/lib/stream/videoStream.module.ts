import { Module } from '@nestjs/common';
import { CloudFrontProvider } from '../providers/cloudFront.provider';
import { VideoStreamService } from './videoStream.service';
import { VideoStreamController } from './videoStream.controller';

@Module({
  controllers: [VideoStreamController],
  providers: [CloudFrontProvider, VideoStreamService],
  exports: [],
})
export class VideoStreamModule {}
