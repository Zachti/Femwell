import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from '@backend/auth';
import { VideoStreamService } from './videoStream.service';
import { Role, Roles } from '@backend/infrastructure';

@Controller('video')
export class VideoStreamController {
  constructor(private readonly videoStreamService: VideoStreamService) {}
  @Get()
  @Auth()
  @Roles([Role.Premium, Role.Padulla])
  async stream(@Query('videoName') videoName: string): Promise<URL> {
    return await this.videoStreamService.stream(videoName);
  }
}
