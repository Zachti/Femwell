import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const heimdallConfig = registerAs('heimdall', () => ({
  awsBucket: process.env['AWS_BUCKET'],
  baseFolderLocation: process.env['BUCKET_LOCATION_BASE_FOLDER'],
  maxFileSize: process.env['MAX_FILE_SIZE'],
  s3Endpoint: process.env['AWS_S3_ENDPOINT'],
  checkListKey: process.env['S3_CHECKLIST_KEY'],
  supportEmail: process.env['SUPPORT_EMAIL'],
}));

const heimdallConfigurationValidationSchema = Joi.object({
  AWS_BUCKET: Joi.string().required(),
  BUCKET_LOCATION_BASE_FOLDER: Joi.string().required(),
  MAX_FILE_SIZE: Joi.string().required(),
  AWS_S3_ENDPOINT: Joi.string().required(),
  S3_CHECKLIST_KEY: Joi.string().required(),
  SUPPORT_EMAIL: Joi.string().required(),
});

export const heimdallConfigObject = {
  config: heimdallConfig,
  validationSchema: heimdallConfigurationValidationSchema,
};
