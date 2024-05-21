import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const vaultConfig = registerAs('vault', () => ({
  wolverineGraphqlEndpoint: process.env['WOLVERINE_ENDPOINT'] ?? '',
}));

const vaultConfigurationValidationSchema = Joi.object({
  WOLVERINE_ENDPOINT: Joi.string().uri().required(),
});

export const vaultConfigObject = {
  config: vaultConfig,
  validationSchema: vaultConfigurationValidationSchema,
};
