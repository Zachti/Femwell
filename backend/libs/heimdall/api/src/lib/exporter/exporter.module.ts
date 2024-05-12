import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ExporterService } from './exporter.service';
import { ExporterController } from './exporter.controller';

@Module({
  providers: [EmailService, ExporterService],
  controllers: [ExporterController],
})
export class ExporterModule {}
