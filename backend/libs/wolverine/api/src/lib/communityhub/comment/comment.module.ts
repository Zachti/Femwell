import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { SqsService } from '../../sqs/sqs.service';

@Module({
  providers: [CommentResolver, CommentService, SqsService],
})
export class CommentModule {}
