import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './GqlConfigService';
import {
  UserModule,
  PostModule,
  CommentModule,
  LikeModule,
  QuestionnaireModule,
  LiveChatModule,
  LiveChatService,
} from '../index';
import {
  UserService,
  PostService,
  CommentService,
  LikeService,
  QuestionnaireService,
} from '../index';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [
        UserModule,
        PostModule,
        CommentModule,
        LikeModule,
        QuestionnaireModule,
        LiveChatModule,
      ],
      inject: [
        UserService,
        PostService,
        CommentService,
        LikeService,
        QuestionnaireService,
        LiveChatService,
      ],
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
  ],
})
export class GraphqlCoreModule {}
