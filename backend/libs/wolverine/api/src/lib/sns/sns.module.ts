import { Module } from '@nestjs/common';
import { NotificationService } from './sns.service';

@Module({
  providers: [NotificationService],
})
export class NotificationModule {}
