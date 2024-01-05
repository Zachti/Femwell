import { Global, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './audit-module.definitions';
import { AuditService } from './audit.service';
import { AUDIT_STORE_PROVIDER } from './constants';
import { Credentials, Kinesis } from 'aws-sdk';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from '@backend/config';

@Global()
@Module({
  providers: [
    AuditService,
    {
      provide: 'AUDIT_STORE_PROVIDER',
      useFactory: (awsCfg: ConfigType<typeof awsConfig>) => {
        return new Kinesis({
          region: awsCfg.region,
          endpoint: awsCfg.kinesisEndpoint,
          credentials: new Credentials({
            accessKeyId: awsCfg.accessKey!,
            secretAccessKey: awsCfg.secretKey!,
          }),
        });
      },
      inject: [awsConfig.KEY],
    },
  ],
  exports: [AuditService, MODULE_OPTIONS_TOKEN, AUDIT_STORE_PROVIDER],
})
export class AuditCoreModule extends ConfigurableModuleClass {}
