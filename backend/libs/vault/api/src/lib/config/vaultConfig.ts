import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const vaultConfig = registerAs('vault', () => ({}));

const vaultConfigurationValidationSchema = Joi.object({});

export const vaultConfigObject = {
  config: vaultConfig,
  validationSchema: vaultConfigurationValidationSchema,
};
