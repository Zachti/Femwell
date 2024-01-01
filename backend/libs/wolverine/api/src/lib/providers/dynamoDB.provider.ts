import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


export const InjectDynamoDBToken = () => Inject(DynamoDBToken)

export const DynamoDBToken = Symbol('DynamoDB_TOKEN')

export const DynamoDBProvider: Provider = {

  provide: DynamoDBToken,
  useFactory: (configService: ConfigService) => {
    return new DynamoDBClient({
      region:configService.get<string>('AWS_S3_REGION')! ,
      credentials: {
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY')!,
        accessKeyId:configService.get<string>('AWS_ACCESS_KEY')!,
      },
    })
  },
  inject: [ConfigService]
}
