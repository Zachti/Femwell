import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { QuestionnaireRepository } from './repository/Questionnaire.repository';
@Injectable()
export class QuestionnaireService {
  constructor(private readonly questionnaireRepository: QuestionnaireRepository) {
  }
  create(input: CreateQuestionnaireInput) {
    return this.questionnaireRepository.create(input);
  }

  findAll() {
    return this.questionnaireRepository.findAll();
  }

  findOne(id: string) {
    return this.questionnaireRepository.findOne(id);
  }
}
