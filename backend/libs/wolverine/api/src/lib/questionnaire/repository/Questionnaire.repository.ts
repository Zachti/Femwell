import { InjectDynamoDBToken } from '../../providers/dynamoDB.provider';
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Questionnaire } from '../entities/questionnaire.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateQuestionnaireInput } from '../dto/createQuestionnaire.input';
import { TablesName } from '../enums/tablesName.enum';

@Injectable()
export class QuestionnaireRepository {
  constructor(@InjectDynamoDBToken() private readonly client: DynamoDBClient) {}
  async findAll(): Promise<Questionnaire[]> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: TablesName.Questionnaire,
      }),
    );
    return (
      res.Items?.map((item) =>
        Questionnaire.createInstanceFromDynamoDBObject(item),
      ) ?? []
    );
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
    if (!res.Item)
      throw new BadRequestException(
        'No Questionnaire found with the specified ID in the database.',
      );
    return Questionnaire.createInstanceFromDynamoDBObject(res.Item);
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

    if (!dynamoDBObject['id'].S)
      throw new InternalServerErrorException(
        'Failed to create Questionnaire object in DynamoDB.',
      );
    return {
      id: dynamoDBObject['id'].S!,
      username: input.username,
      responses: input.responses,
    };
  }
}
