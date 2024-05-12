import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const dendenConfig = registerAs('denden', () => ({
  cloudFrontEndpoint: process.env['AWS_CLOUD_FRONT_ENDPOINT'],
  cloudFrontDistributionId: process.env['AWS_CLOUD_FRONT_DISTRIBUTION_ID'],
}));

const dendenConfigurationValidationSchema = Joi.object({
  AWS_CLOUD_FRONT_ENDPOINT: Joi.string().required(),
  AWS_CLOUD_FRONT_DISTRIBUTION_ID: Joi.string().required(),
});

export const dendenConfigObject = {
  config: dendenConfig,
  validationSchema: dendenConfigurationValidationSchema,
};
