import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { UpdateQuestionnaireInput } from './dto/update-questionnaire.input';

@Injectable()
export class QuestionnaireService {
  create(createQuestionnaireInput: CreateQuestionnaireInput) {
    return 'This action adds a new questionnaire';
  }

  findAll() {
    return `This action returns all questionnaire`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionnaire`;
  }

  update(id: number, updateQuestionnaireInput: UpdateQuestionnaireInput) {
    return `This action updates a #${id} questionnaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionnaire`;
  }
}
