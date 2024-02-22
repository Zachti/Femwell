import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
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
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
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
      driver: ApolloFederationDriver,
      useClass: GqlConfigService,
    }),
  ],
})
export class GraphqlCoreModule {}
