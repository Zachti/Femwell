import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Format } from 'logform';
import * as winston from 'winston';
import {
  LoggerModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './loggerModuleDefinitions';
import { commonConfig } from '@backend/config';

@Injectable()
export class LoggerService {
  private readonly _logger: winston.Logger;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly moduleOptions: LoggerModuleOptions,
    @Inject(commonConfig.KEY)
    private readonly config: ConfigType<typeof commonConfig>,
  ) {
    this._logger = winston.createLogger({
      defaultMeta: {
        serviceName: this.moduleOptions.serviceName,
        environment: this.config.nodeEnv,
      },
      level: moduleOptions.logLevel || this.config.logLevel,
      transports: [new winston.transports.Console()],
      format: this.getEnvFormat(),
    });
    this._logger.info('logger initiated', { level: this._logger.level });
  }

  getEnvFormat(): Format {
    if (this.config.isLiveEnv)
      return winston.format.combine(
        winston.format.timestamp(),
        winston.format.logstash(),
      );
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.prettyPrint(),
    );
  }

  log(message: any, ...optionalParams: any[]): void {
    this.logger.debug(message, { ...optionalParams });
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(
    message: string,
    metadata?: Record<string, any>,
    error?: unknown,
  ): void {
    if (error instanceof Error && metadata) {
      metadata['error'] = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }
    this.logger.error(message);
  }

  private get logger(): winston.Logger {
    return this._logger;
  }
}
