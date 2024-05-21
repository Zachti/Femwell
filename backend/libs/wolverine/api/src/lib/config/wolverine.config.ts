import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const wolverineConfig = registerAs('wolverine', () => ({
  snsTopicArn: process.env['SNS_TOPIC_ARN'],
}));

const wolverineConfigurationValidationSchema = Joi.object({
  SNS_TOPIC_ARN: Joi.string().required(),
});

export const wolverineConfigObject = {
  config: wolverineConfig,
  validationSchema: wolverineConfigurationValidationSchema,
};
