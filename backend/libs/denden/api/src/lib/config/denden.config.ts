import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const dendenConfig = registerAs('denden', () => ({
  cloudFrontEndpoint: process.env['AWS_CLOUD_FRONT_ENDPOINT'],
}));

const dendenConfigurationValidationSchema = Joi.object({
  AWS_CLOUD_FRONT_ENDPOINT: Joi.string().required(),
});

export const dendenConfigObject = {
  config: dendenConfig,
  validationSchema: dendenConfigurationValidationSchema,
};
