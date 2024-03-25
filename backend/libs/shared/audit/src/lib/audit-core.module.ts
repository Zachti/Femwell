import { Global, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './audit-module.definitions';
import { AuditService } from './audit.service';
import { AUDIT_STORE_PROVIDER } from './constants';
import { ConfigType } from '@nestjs/config';
import { awsConfig, commonConfig } from '@backend/config';
import { Kinesis } from '@aws-sdk/client-kinesis';
import { fromEnv } from '@aws-sdk/credential-providers';

@Global()
@Module({
  providers: [
    AuditService,
    {
      provide: 'AUDIT_STORE_PROVIDER',
      useFactory: (
        awsCfg: ConfigType<typeof awsConfig>,
        config: ConfigType<typeof commonConfig>,
      ) => {
        return config.isLiveEnv
          ? {}
          : new Kinesis({
              region: awsCfg.region,
              endpoint: awsCfg.kinesisEndpoint,
              credentials: fromEnv(),
            });
      },
      inject: [awsConfig.KEY, commonConfig.KEY],
    },
  ],
  exports: [AuditService, MODULE_OPTIONS_TOKEN, AUDIT_STORE_PROVIDER],
})
export class AuditCoreModule extends ConfigurableModuleClass {}
