import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const awsConfig = registerAs('aws', () => ({
  region: process.env['AWS_REGION'],
  accessKey: process.env['AWS_ACCESS_KEY'],
  secretKey: process.env['AWS_SECRET_KEY'],
  userPoolId: process.env['COGNITO_USER_POOL_ID'],
  clientId: process.env['COGNITO_CLIENT_ID'],
}));

const awsConfigurationValidationSchema = Joi.object({
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string(),
});

export const awsConfigObject = {
  config: awsConfig,
  validationSchema: awsConfigurationValidationSchema,
};
