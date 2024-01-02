import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { QuestionnaireRepository } from './repository/Questionnaire.repository';
import { Questionnaire } from './entities/questionnaire.entity';
@Injectable()
export class QuestionnaireService {
  constructor(private readonly questionnaireRepository: QuestionnaireRepository) {
  }
  create(input: CreateQuestionnaireInput): Promise<Questionnaire> {
    return this.questionnaireRepository.create(input);
  }

  findAll(): Promise<Questionnaire[]> {
    return this.questionnaireRepository.findAll();
  }

   findOne(id: string): Promise<Questionnaire> {
    return this.questionnaireRepository.findOne(id);
  }
}
