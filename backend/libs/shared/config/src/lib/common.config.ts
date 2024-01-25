import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

enum Environment {
  development = 'development',
  production = 'production',
}

const nodeEnv = process.env['NODE_ENV'] ?? 'LOCAL';

const liveEnvs = Object.keys(Environment);

export const commonConfig = registerAs('common', () => ({
  nodeEnv,
  logLevel: process.env['LOG_LEVEL'] || 'debug',
  isLiveEnv: liveEnvs.some((val) => val === nodeEnv),
  isProduction: nodeEnv === Environment.production,
}));

export const commonConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .not(
      'dev',
      'prod',
      'DEV',
      'PROD',
      'DEVELOPMENT',
      'PRODUCTION',
      'Dev',
      'Prod',
    )
    .required(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').optional(),
});
