import { Module } from '@nestjs/common';
import { CloudFrontProvider } from '../providers/cloudFront.provider';
import { VideoStreamService } from './videoStream.service';

@Module({
  controllers: [],
  providers: [CloudFrontProvider, VideoStreamService],
  exports: [],
})
export class VideoStreamModule {}
