import { S3 } from 'aws-sdk';
import { Inject, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from '@backend/config';

export const InjectS3Token = () => Inject(s3Token);

export const s3Token = Symbol('S3_TOKEN');

export const s3Provider: Provider = {
  provide: s3Token,
  useFactory: (config: ConfigType<typeof awsConfig>) => {
    return new S3({
      region: config.region!,
      credentials: {
        secretAccessKey: config.secretKey!,
        accessKeyId: config.accessKey!,
      },
    });
  },
  inject: [awsConfig.KEY],
};
