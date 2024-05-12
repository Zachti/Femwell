import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const awsConfig = registerAs('aws', () => ({
  localDevConfigOverride: {
    region: process.env['AWS_REGION'],
    credentials: {
      secretAccessKey: process.env['AWS_SECRET_KEY'] ?? '',
      accessKeyId: process.env['AWS_ACCESS_KEY'] ?? '',
      sessionToken: process.env['AWS_SESSION_TOKEN'] ?? '',
    },
  },
  streamARN: process.env['STREAM_ARN'],
  userPoolId: process.env['COGNITO_USER_POOL_ID'] ?? '',
  clientId: process.env['COGNITO_CLIENT_ID'] ?? '',
}));

const awsConfigurationValidationSchema = Joi.object({
  AWS_REGION: Joi.string(),
  AWS_ACCESS_KEY: Joi.string(),
  AWS_SECRET_KEY: Joi.string(),
  AWS_SESSION_TOKEN: Joi.string(),
  STREAM_ARN: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
});

export const awsConfigObject = {
  config: awsConfig,
  validationSchema: awsConfigurationValidationSchema,
};
