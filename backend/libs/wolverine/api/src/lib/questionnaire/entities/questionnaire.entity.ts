import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLString } from 'graphql/type';
import { QuestionAnswerInput } from '../dto/questionAnswers.input';
import { GraphQLUUID } from 'graphql-scalars';
import { CreateQuestionnaireInput } from '../dto/createQuestionnaire.input';
import {v4 as uuidv4} from 'uuid'
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { QuestionnaireDBObject } from '../interfaces/interfaces';

@ObjectType()
export class Questionnaire {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLString)
  username!: string;

  @Field(() => [QuestionAnswerInput])
  responses!: QuestionAnswerInput[];

  static createInstanceFromDynamoDBObject(data: any): QuestionnaireDBObject {
    return {
      id: data.id.S,
      username: data.username.S,
      responses: data.responses.S,
    }
  }
  static createDynamoDBObjectFromInstance(input: CreateQuestionnaireInput, responsesId: string): Record<string,AttributeValue> {
    return {
      id: {
        S: uuidv4()
      },
      username: {
        S: input.username
      },
      responsesId: {
        S: responsesId
      },
    }
  }
}
