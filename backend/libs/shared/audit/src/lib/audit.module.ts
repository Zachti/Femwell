import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  AuditModuleFeatureOptions,
  AuditModuleOptions,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} from './audit-module.definitions';
import { AuditCoreModule } from './audit-core.module';
import { AuditService } from './audit.service';
import { AUDIT_STORE_PROVIDER } from './constants';
import { LoggerService } from '@backend/logger';
import { generateAuditToken } from './audit.decorator';

@Module({})
export class AuditModule {
  static forRoot(options: AuditModuleOptions): DynamicModule {
    return AuditCoreModule.forRoot(options);
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return AuditCoreModule.forRootAsync(options);
  }

  static forFeature(featureOptions: AuditModuleFeatureOptions): DynamicModule {
    const NamespacedAuditService: Provider = {
      provide: generateAuditToken(featureOptions.namespace),
      useFactory: (moduleOptions, logger: LoggerService, store) => {
        return new AuditService(moduleOptions, logger, store, featureOptions);
      },
      inject: [MODULE_OPTIONS_TOKEN, LoggerService, AUDIT_STORE_PROVIDER],
    };
    return {
      module: AuditModule,
      providers: [NamespacedAuditService],
      exports: [NamespacedAuditService],
    };
  }
}
