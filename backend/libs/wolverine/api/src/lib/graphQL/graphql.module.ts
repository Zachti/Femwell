import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './GqlConfigService';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      imports: [
        QuestionnaireModule,
      ],
      inject: [
        QuestionnaireService,
      ],
      driver: ApolloFederationDriver,
      useClass: GqlConfigService,
    }),
  ],
})
export class GraphqlCoreModule {}
