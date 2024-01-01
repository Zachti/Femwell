import { InjectDynamoDBToken } from '../../providers/dynamoDB.provider';
import { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Questionnaire } from '../entities/questionnaire.entity';
import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireInput } from '../dto/createQuestionnaire.input';
import { QuestionAnswerInput } from '../dto/questionAnswers.input';
import { TablesName } from '../enums/tablesName.enum';
import { QuestionnaireDBObject } from '../interfaces/interfaces';

@Injectable()
export class QuestionnaireRepository {
  constructor(@InjectDynamoDBToken() private readonly client: DynamoDBClient) {
  }

  async findAll(): Promise<Questionnaire[]> {
    const result: Questionnaire[] = [];
    const command = new ScanCommand({
      TableName: TablesName.Questionnaire,
    });
    const response = await this.client.send(command);
    const questionnaireInstances = response.Items?.map((item) => Questionnaire.createInstanceFromDynamoDBObject(item));
    if (questionnaireInstances === undefined ) return [];
    for (const instance of questionnaireInstances) {
      result.push({
        id: instance.id,
        username: instance.username,
        responses: await this.getAllQuestionnaireResponses(instance),
        });
    }
    return result;
  }
  async create(input: CreateQuestionnaireInput): Promise<CreateQuestionnaireInput> {
    const responseIds: string[] = await Promise.all(input.responses.map((response) => {
      const itemObject = QuestionAnswerInput.createDynamoDBObjectFromInstance(response)
      const command = new PutItemCommand({
        TableName: TablesName.Responses,
        Item: itemObject
      })
      this.client.send(command);
      return itemObject['id'].S;
    })) as string[];
    const itemObject = Questionnaire.createDynamoDBObjectFromInstance(input, responseIds.join(','));
    const command = new PutItemCommand({
      TableName: TablesName.Questionnaire,
      Item: itemObject
    })
    await this.client.send(command);
    return input;
  }

  async findOne(id: string): Promise<Questionnaire> {
    const command = new GetItemCommand({
      TableName: TablesName.Questionnaire,
      Key: {
        id: {
          S: id
        }
      }
    });
    const response = await this.client.send(command);
    const QuestionnaireDBObject = Questionnaire.createInstanceFromDynamoDBObject(response.Item);
    return {
      id: QuestionnaireDBObject.id,
      username: QuestionnaireDBObject.username,
      responses: await this.getAllQuestionnaireResponses(QuestionnaireDBObject),
    }
  }

  async getResponseByIds(ids: string[]){
    return ids.map(async (id: string) => {
      const command = new GetItemCommand({
        TableName: TablesName.Responses,
        Key: {
          id: {
            S: id
          }
        }
      });
      const result = await this.client.send(command);
      return QuestionAnswerInput.createInstanceFromDynamoDBObject(result.Item);
    });
  }

  private async getAllQuestionnaireResponses(instance: QuestionnaireDBObject): Promise<QuestionAnswerInput[]> {
    const responseIds = instance.responses.split(',').map((id: string) => id.trim());
    const QandA = await this.getResponseByIds(responseIds);
    return QandA as unknown as QuestionAnswerInput[];
  }
}
