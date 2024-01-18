import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  AWSModuleOptions,
  AWSModuleAsyncOptions,
  AWSServiceCtor,
} from './types';
import { getAwsServiceToken } from './tokens';

@Module({})
export class AWSSdkModule {
  static forRoot<C extends AWSServiceCtor[]>(
    options: AWSModuleOptions<C>,
  ): DynamicModule {
    const services: Provider[] = options.services.map((s) => {
      const config = s.options ?? {};
      return {
        provide: getAwsServiceToken(s.client),
        useValue: new s.client(config),
      };
    });
    return {
      module: AWSSdkModule,
      global: true,
      providers: services,
      exports: services,
    };
  }

  static forRootWithAsyncOptions<C extends AWSServiceCtor[]>(
    options: AWSModuleAsyncOptions<C>,
  ): DynamicModule {
    const optionsProvider: Provider = {
      provide: 'AWS_SERVICE_CONFIG',
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    const servicesProviders: Provider[] = options.serviceObjects.map((s) => {
      const config = s.options ?? {};
      return {
        provide: getAwsServiceToken(s.client),
        useFactory: (serviceConfig: any) => {
          const conf = { ...config, serviceConfig };
          return new s.client(conf);
        },
        inject: ['AWS_SERVICE_CONFIG'],
      };
    });
    return {
      module: AWSSdkModule,
      global: true,
      providers: [optionsProvider, ...servicesProviders],
      exports: servicesProviders,
    };
  }
}
