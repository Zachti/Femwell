import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { SnsService } from '../sns/sns.service';

@Module({
  providers: [EventResolver, EventService, SnsService],
})
export class EventModule {}
