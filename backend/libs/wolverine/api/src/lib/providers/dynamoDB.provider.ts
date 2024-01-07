import { Inject, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { awsConfig } from '@backend/config';

export const InjectDynamoDBToken = () => Inject(DynamoDBToken);

export const DynamoDBToken = Symbol('DYNAMO_DB_TOKEN');

export const DynamoDBProvider: Provider = {
  provide: DynamoDBToken,
  useFactory: (config: ConfigType<typeof awsConfig>) => {
    return new DynamoDBClient({
      region: config.region!,
      credentials: {
        secretAccessKey: config.secretKey!,
        accessKeyId: config.accessKey!,
      },
    });
  },
  inject: [awsConfig.KEY],
};
