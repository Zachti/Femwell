import { createConfigurableModule } from '../../../utils/src/lib/configurable-module/configurable-module.utils';

export interface LoggerModuleOptions {
  serviceName: string;
  environment?: string;
  logLevel?: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  createConfigurableModule<LoggerModuleOptions>();
