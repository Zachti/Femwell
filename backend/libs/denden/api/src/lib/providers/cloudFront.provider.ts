import { CloudFront } from 'aws-sdk';
import { Inject, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from '@backend/config';

export const InjectCloudFrontToken = () => Inject(CloudFrontToken);

export const CloudFrontToken = Symbol('CLOUD_FRONT_TOKEN');

export const CloudFrontProvider: Provider = {
  provide: CloudFrontToken,
  useFactory: (config: ConfigType<typeof awsConfig>) => {
    return new CloudFront({
      region: config.region!,
      credentials: {
        secretAccessKey: config.secretKey!,
        accessKeyId: config.accessKey!,
      },
    });
  },
  inject: [awsConfig.KEY],
};
