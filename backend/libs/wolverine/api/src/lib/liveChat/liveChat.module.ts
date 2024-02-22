import { Module } from '@nestjs/common';
import { LiveChatService } from './liveChat.service';
import { LiveChatResolver } from './liveChat.resolver';
import { PubSubProvider } from './providers/pubSub.provider';
import { UserService } from '../shared/user/user.service';

@Module({
  providers: [LiveChatResolver, LiveChatService, PubSubProvider, UserService],
})
export class LiveChatModule {}
