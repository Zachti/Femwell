import { InjectDynamoDBToken } from '../../providers/dynamoDB.provider';
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Questionnaire } from '../entities/questionnaire.entity';
import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from '../dto/createQuestionnaire.input';
// import { QuestionAnswer } from '../entities/questionAnswers.entity';
import { TablesName } from '../enums/tablesName.enum';
import { QuestionnaireDBObject } from '../interfaces/interfaces';

@Injectable()
export class QuestionnaireRepository {
  constructor(@InjectDynamoDBToken() private readonly client: DynamoDBClient) {}
  async findAll(): Promise<Questionnaire[]> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: TablesName.Questionnaire,
      }),
    );
    const questionnaireInstances = res.Items?.map((item) =>
      Questionnaire.createInstanceFromDynamoDBObject(item),
    );
    return questionnaireInstances ?? [];
  }

  async findOne(id: string): Promise<Questionnaire> {
    const res = await this.client.send(
      new GetItemCommand({
        TableName: TablesName.Questionnaire,
        Key: {
          id: {
            S: id,
          },
        },
      }),
    );
    if (!res.Item) throw new Error('Questionnaire not found');
    const QuestionnaireDBObject =
      Questionnaire.createInstanceFromDynamoDBObject(res.Item);
    return QuestionnaireDBObject;
  }

  async create(input: CreateQuestionnaireInput): Promise<Questionnaire> {
    const dynamoDBObject =
      Questionnaire.createDynamoDBObjectFromInstance(input);
    await this.client.send(
      new PutItemCommand({
        TableName: TablesName.Questionnaire,
        Item: dynamoDBObject,
      }),
    );
    const questionnaire = new Questionnaire();

    if (dynamoDBObject['id'] && dynamoDBObject['id'].S) {
      questionnaire.id = dynamoDBObject['id'].S;
    } else {
      throw new Error('DynamoDBObject creation failed');
    }

    questionnaire.username = input.username;
    questionnaire.responses = input.responses;
    return questionnaire;
  }

  // async getResponseByIds(ids: string[]) {
  //   return ids.map(async (id: string) => {
  //     const result = await this.client.send(
  //       new GetItemCommand({
  //         TableName: TablesName.Responses,
  //         Key: {
  //           id: {
  //             S: id,
  //           },
  //         },
  //       }),
  //     );
  //     return QuestionAnswer.createInstanceFromDynamoDBObject(result.Item);
  //   });
  // }

  // private async getAllQuestionnaireResponses(
  //   instance: QuestionnaireDBObject,
  // ): Promise<QuestionAnswer[]> {
  //   const responseIds = instance.responses
  //     .split(',')
  //     .map((id: string) => id.trim());
  //   const QandA = await this.getResponseByIds(responseIds);
  //   return QandA as unknown as QuestionAnswer[];
  // }
}
