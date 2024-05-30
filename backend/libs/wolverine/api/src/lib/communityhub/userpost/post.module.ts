import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { SqsService } from '../../sqs/sqs.service';
import { UserService } from '../../shared/user/user.service';

@Module({
  providers: [PostResolver, PostService, SqsService, UserService],
})
export class PostModule {}
