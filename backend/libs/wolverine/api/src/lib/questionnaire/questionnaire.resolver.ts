import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire } from './entities/questionnaire.entity';
import { CreateQuestionnaireInput } from './dto/createQuestionnaire.input';
import { GraphQLUUID } from 'graphql-scalars';

@Resolver(() => Questionnaire)
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}
  @Mutation(() => Questionnaire)
  async createQuestionnaire(@Args('createQuestionnaireInput') createQuestionnaireInput: CreateQuestionnaireInput) {
    return await this.questionnaireService.create(createQuestionnaireInput);
  }
  @Query(() => [Questionnaire], { name: 'questionnaire' })
  async findAll() {
    return await this.questionnaireService.findAll();
  }
  @Query(() => Questionnaire, { name: 'questionnaire' })
  async findOne(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return await this.questionnaireService.findOne(id);
  }
}
