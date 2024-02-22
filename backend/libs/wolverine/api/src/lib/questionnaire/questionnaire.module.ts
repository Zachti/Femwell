import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireResolver } from './questionnaire.resolver';

@Module({
  providers: [QuestionnaireResolver, QuestionnaireService],
})
export class QuestionnaireModule {}
