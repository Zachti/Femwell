import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const wolverineConfig =
  registerAs('wolverine', () => ({}));

const wolverineConfigurationValidationSchema = Joi.object({});

export const wolverineConfigObject = {
  config: wolverineConfig,
  validationSchema: wolverineConfigurationValidationSchema,
};
