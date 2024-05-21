import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire, CreateQuestionnaireInput } from '../index';
import { GraphQLUUID } from 'graphql-scalars';

@Resolver(() => Questionnaire)
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Mutation(() => Questionnaire)
  async createQuestionnaire(
    @Args('createQuestionnaireInput')
    createQuestionnaireInput: CreateQuestionnaireInput,
  ) {
    return await this.questionnaireService.createQuestionnaire(
      createQuestionnaireInput,
    );
  }

  @Query(() => [Questionnaire], { name: 'questionnaire' })
  async findAll() {
    return await this.questionnaireService.findAll();
  }

  @Query(() => Questionnaire, { name: 'oneQuestionnaire' })
  async findOne(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return await this.questionnaireService.findOne(id);
  }

  @Query(() => Questionnaire, { name: 'questionnaireByUserId' })
  async findOneByUser(@Args('id', { type: () => GraphQLUUID }) userId: string) {
    return await this.questionnaireService.findOneByUser(userId);
  }
}
