import { Controller, Post, Body, LoggerService } from '@nestjs/common';
import { ExporterService } from './exporter.service';

@Controller('export')
export class ExporterController {
  constructor(private readonly exporterService: ExporterService) {}

  @Post()
  async exportFile(@Body('userEmail') userEmail: string) {
    return await this.exporterService.export(userEmail);
  }
}
