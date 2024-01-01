import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire } from './entities/questionnaire.entity';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';

@Resolver(() => Questionnaire)
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Mutation(() => Questionnaire)
  createQuestionnaire(@Args('createQuestionnaireInput') createQuestionnaireInput: CreateQuestionnaireInput) {
    return this.questionnaireService.create(createQuestionnaireInput);
  }

  @Query(() => [Questionnaire], { name: 'questionnaire' })
  findAll() {
    return this.questionnaireService.findAll();
  }

  @Query(() => Questionnaire, { name: 'questionnaire' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionnaireService.findOne(id);
  }

  @Mutation(() => Questionnaire)
  removeQuestionnaire(@Args('id', { type: () => Int }) id: number) {
    return this.questionnaireService.remove(id);
  }
}
