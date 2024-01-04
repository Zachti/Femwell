import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const heimdallConfig = registerAs('heimdall', () => ({
  awsBucket: process.env['AWS_BUCKET'],
  baseFolderLocation: process.env['BUCKET_LOCATION_BASE_FOLDER'],
  maxFileSize: process.env['MAX_FILE_SIZE'],
  s3Endpoint: process.env['AWS_S3_ENDPOINT'],
}));

const heimdallConfigurationValidationSchema = Joi.object({
  AWS_BUCKET: Joi.string().required(),
  BUCKET_LOCATION_BASE_FOLDER: Joi.string().required(),
  MAX_FILE_SIZE: Joi.string().required(),
  AWS_S3_ENDPOINT: Joi.string().required(),
});

export const heimdallConfigObject = {
  config: heimdallConfig,
  validationSchema: heimdallConfigurationValidationSchema,
};
