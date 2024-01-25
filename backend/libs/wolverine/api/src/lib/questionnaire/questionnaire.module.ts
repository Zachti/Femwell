import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireResolver } from './questionnaire.resolver';
import { QuestionnaireRepository } from './repository/Questionnaire.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    QuestionnaireResolver,
    QuestionnaireService,
    QuestionnaireRepository,
  ],
})
export class QuestionnaireModule {}
