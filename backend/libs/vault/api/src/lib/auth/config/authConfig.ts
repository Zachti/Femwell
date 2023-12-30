import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const authConfig = registerAs('auth', () => ({
  userPoolId: process.env['COGNITO_USER_POOL_ID'],
  clientId: process.env['COGNITO_CLIENT_ID'],
}));

const authConfigurationValidationSchema = Joi.object({
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
});

export const authConfigObject = {
  config: authConfig,
  validationSchema: authConfigurationValidationSchema,
};
