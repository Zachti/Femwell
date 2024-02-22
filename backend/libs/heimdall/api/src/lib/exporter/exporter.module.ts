import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ExporterService } from './exporter.service';

@Module({
  providers: [EmailService, ExporterService],
})
export class ExporterModule {}
