import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireResolver } from './questionnaire.resolver';
import { DynamoDBProvider } from '../providers/dynamoDB.provider';
import { QuestionnaireRepository } from './repository/Questionnaire.repository';

@Module({
  providers: [
    QuestionnaireResolver,
    QuestionnaireService,
    DynamoDBProvider,
    QuestionnaireRepository,
  ],
})
export class QuestionnaireModule {}
