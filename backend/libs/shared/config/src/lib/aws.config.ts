import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigObject } from './configModuleOptions';

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
  STREAM_ARN: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
});

export const awsConfigObject: ConfigObject = {
  config: awsConfig,
  validationSchema: awsConfigurationValidationSchema,
};
