import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const uploadConfig = registerAs('upload', () => ({
  s3Region: process.env['AWS_S3_REGION'],
  accessKey: process.env['AWS_ACCESS_KEY'],
  secretKey: process.env['AWS_SECRET_KEY'],
  awsBucket: process.env['AWS_BUCKET'],
  baseFolderLocation: process.env['BUCKET_LOCATION_BASE_FOLDER'],
  maxFileSize: process.env['MAX_FILE_SIZE']
}));

const uploadConfigurationValidationSchema = Joi.object({
  AWS_S3_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  AWS_BUCKET: Joi.string().required(),
  BUCKET_LOCATION_BASE_FOLDER: Joi.string().required(),
  MAX_FILE_SIZE: Joi.string().required()
});

export const uploadConfigObject = {
  config: uploadConfig,
  validationSchema: uploadConfigurationValidationSchema,
};
