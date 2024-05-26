import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const wolverineConfig = registerAs('wolverine', () => ({
  snsTopicArn: process.env['SNS_TOPIC_ARN'],
  postLimit: Number(process.env['POST_LIMIT']),
}));

const wolverineConfigurationValidationSchema = Joi.object({
  SNS_TOPIC_ARN: Joi.string().required(),
  POST_LIMIT: Joi.string().default('50'),
});

export const wolverineConfigObject = {
  config: wolverineConfig,
  validationSchema: wolverineConfigurationValidationSchema,
};
