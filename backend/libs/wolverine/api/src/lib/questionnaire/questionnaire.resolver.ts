import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire, CreateQuestionnaireInput } from '../index';
import { GraphQLUUID } from 'graphql-scalars';

@Resolver(() => Questionnaire)
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Mutation(() => Questionnaire)
  createQuestionnaire(
    @Args('createQuestionnaireInput')
    createQuestionnaireInput: CreateQuestionnaireInput,
  ) {
    return this.questionnaireService.createQuestionnaire(
      createQuestionnaireInput,
    );
  }

  @Query(() => [Questionnaire], { name: 'questionnaire' })
  findAll() {
    return this.questionnaireService.findAll();
  }

  @Query(() => Questionnaire, { name: 'oneQuestionnaire' })
  findOne(@Args('id', { type: () => GraphQLUUID }) id: string) {
    return this.questionnaireService.findOne(id);
  }

  @Query(() => Questionnaire, { name: 'questionnaireByUserId' })
  findOneByUser(@Args('id', { type: () => GraphQLUUID }) userId: string) {
    return this.questionnaireService.findOneByUser(userId);
  }
}
