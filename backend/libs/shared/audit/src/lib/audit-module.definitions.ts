import { createConfigurableModule } from '@backend/configurable-module';

export interface AuditModuleOptions {
  streamARN: string;
  maxBufferSize?: number;
  flushIntervalMS?: number;
}

export interface AuditModuleFeatureOptions {
  namespace: string;
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = createConfigurableModule<AuditModuleOptions>();
