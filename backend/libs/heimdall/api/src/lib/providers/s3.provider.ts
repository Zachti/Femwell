import { S3 } from 'aws-sdk';
import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const InjectS3Token = () => Inject(s3Token);

export const s3Token = Symbol('S3_TOKEN');

export const s3Provider: Provider = {
  provide: s3Token,
  useFactory: (configService: ConfigService) => {
    return new S3({
      region:configService.get<string>('AWS_S3_REGION')! ,
      credentials: {
        secretAccessKey: configService.get<string>('AWS_SECRET_KEY')!,
        accessKeyId:configService.get<string>('AWS_ACCESS_KEY')!,
      },
    });
  },
  inject: [ConfigService],
};
