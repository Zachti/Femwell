import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { Auth } from '@backend/auth';
import { VideoStreamService } from './videoStream.service';

@Controller('video')
export class videoStreamController {
  constructor(private readonly videoStreamService: VideoStreamService) {}
  @Get()
  @Auth()
  async stream(
    @Query('videoId') videoId: string,
    @Query('videoName') videoName: string,
  ): Promise<URL> {
    return await this.videoStreamService.stream(videoName, videoId);
  }
}
