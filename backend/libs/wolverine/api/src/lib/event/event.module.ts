import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { NotificationService } from '../sns/sns.service';

@Module({
  providers: [EventResolver, EventService, NotificationService],
})
export class EventModule {}
