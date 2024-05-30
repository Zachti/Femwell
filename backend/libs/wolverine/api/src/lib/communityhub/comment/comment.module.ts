import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { SqsService } from '../../sqs/sqs.service';
import {UserService} from "../../shared/user/user.service";

@Module({
  providers: [CommentResolver, CommentService, SqsService, UserService],
})
export class CommentModule {}
