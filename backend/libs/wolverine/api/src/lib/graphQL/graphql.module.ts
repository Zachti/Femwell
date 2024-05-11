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
  EventModule,
  EventService,
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
        EventModule,
      ],
      inject: [
        UserService,
        PostService,
        CommentService,
        LikeService,
        QuestionnaireService,
        LiveChatService,
        EventService,
      ],
      driver: ApolloFederationDriver,
      useClass: GqlConfigService,
    }),
  ],
})
export class GraphqlCoreModule {}
