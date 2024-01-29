import { Inject, Injectable } from '@nestjs/common';
import {
  GraphQLClient,
  RequestDocument,
  Variables,
  RequestOptions,
} from 'graphql-request';
import { LoggerService } from '@backend/logger';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { VariablesAndRequestHeadersArgs } from 'graphql-request/src/types';
import { GraphqlDatasourceModuleOptions } from './graphql-datasource-module-definition';

@Injectable()
export class GraphqlDatasource extends GraphQLClient {
  constructor(
    private readonly loggerService: LoggerService,
    @Inject('GRAPHQL_DATASOURCE_MODULE_OPTIONS')
    private readonly options: GraphqlDatasourceModuleOptions,
  ) {
    super(options.endpoint, options.options);
  }

  override async request<T, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>
  ): Promise<T>;
  override async request<T, V extends Variables = Variables>(
    options: RequestOptions<V, T>,
  ): Promise<T>;
  override async request<T, V extends Variables = Variables>(
    documentOrOptions:
      | RequestDocument
      | TypedDocumentNode<T, V>
      | RequestOptions<V>,
    ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>
  ): Promise<T> {
    this.loggerService.debug('making request to GraphQL source', {
      endpoint: this.options.endpoint,
    });
    const res = await super.request<T, V>(
      documentOrOptions as any,
      ...(variablesAndRequestHeaders as any),
    );
    this.loggerService.debug('got response from GraphQL source', {
      res: JSON.stringify(res),
    });
    return res;
  }
}
