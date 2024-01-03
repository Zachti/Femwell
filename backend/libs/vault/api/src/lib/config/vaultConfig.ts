import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const vaultConfig = registerAs('vault', () => ({
  userPoolId: process.env['COGNITO_USER_POOL_ID'],
  clientId: process.env['COGNITO_CLIENT_ID'],
}));

const vaultConfigurationValidationSchema = Joi.object({
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
});

export const vaultConfigObject = {
  config: vaultConfig,
  validationSchema: vaultConfigurationValidationSchema,
};
