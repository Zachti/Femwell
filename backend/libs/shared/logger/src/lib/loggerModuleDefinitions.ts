import { createConfigurableModule } from '@backend/configurable-module';

export interface LoggerModuleOptions {
  serviceName: string;
  environment?: string;
  logLevel?: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  createConfigurableModule<LoggerModuleOptions>();
