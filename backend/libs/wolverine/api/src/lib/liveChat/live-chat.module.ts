import { Module } from '@nestjs/common';
import { LiveChatService } from './live-chat.service';
import { LiveChatResolver } from './live-chat.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LiveChatResolver, LiveChatService],
})
export class LiveChatModule {}
