import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const wolverineConfig = registerAs('wolverine', () => ({
  snsTopicArn: process.env['SNS_TOPIC_ARN'],
  postLimit: Number(process.env['POST_LIMIT']),
  queueUrl: process.env['QUEUE_URL'],
}));

const wolverineConfigurationValidationSchema = Joi.object({
  SNS_TOPIC_ARN: Joi.string().required(),
  POST_LIMIT: Joi.string().default('50'),
  QUEUE_URL: Joi.string().required(),
});

export const wolverineConfigObject = {
  config: wolverineConfig,
  validationSchema: wolverineConfigurationValidationSchema,
};
