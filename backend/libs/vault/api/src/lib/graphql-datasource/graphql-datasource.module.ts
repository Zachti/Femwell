import { DynamicModule, Module } from '@nestjs/common';
import { GraphqlDatasourceModuleOptions } from './graphql-datasource-module-definition';
import { GraphqlDatasource } from './graphql-datasource';

@Module({})
export class GraphqlDatasourceModule {
  static register(options: GraphqlDatasourceModuleOptions): DynamicModule {
    return {
      module: GraphqlDatasourceModule,
      providers: [
        {
          provide: options.injectionKey,
          useClass: GraphqlDatasource,
        },
        {
          provide: 'GRAPHQL_DATASOURCE_MODULE_OPTIONS',
          useValue: options,
        },
      ],
      exports: [options.injectionKey],
    };
  }

  static registerAsync(options: any): DynamicModule {
    return {
      module: GraphqlDatasourceModule,
      providers: [
        {
          provide: 'GRAPHQL_DATASOURCE_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: options.injectionKey,
          useClass: GraphqlDatasource,
        },
      ],
      exports: [options.injectionKey],
    };
  }
}
