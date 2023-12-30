import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const awsConfig = registerAs('upload', () => ({
  s3Region: process.env['AWS_S3_REGION'],
  accessKey: process.env['AWS_ACCESS_KEY'],
  secretKey: process.env['AWS_SECRET_KEY'],
}));

const awsConfigurationValidationSchema = Joi.object({
  AWS_S3_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
});

export const awsConfigObject = {
  config: awsConfig,
  validationSchema: awsConfigurationValidationSchema,
};
