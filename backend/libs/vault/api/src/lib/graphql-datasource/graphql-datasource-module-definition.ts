import { createConfigurableModule } from '@backend/configurable-module';
import { RequestConfig } from 'graphql-request/build/esm/types';

export interface GraphqlDatasourceModuleOptions {
  endpoint: string;
  options?: RequestConfig;
  injectionKey: string;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = createConfigurableModule<GraphqlDatasourceModuleOptions>();
