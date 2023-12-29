import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigurableModuleClass } from './loggerModuleDefinitions';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {}
