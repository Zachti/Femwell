import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './GqlConfigService';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { LiveChatModule } from '../liveChat/live-chat.module';
import { LiveChatService } from '../liveChat/live-chat.service';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      imports: [QuestionnaireModule, LiveChatModule],
      inject: [QuestionnaireService, LiveChatService],
      driver: ApolloFederationDriver,
      useClass: GqlConfigService,
    }),
  ],
})
export class GraphqlCoreModule {}
