import { DeployConfigService } from './deploy-config.service';

export const deployConfigProvider = {
  provide: 'DEPLOY_CONFIG_PROVIDER',
  useClass: DeployConfigService,
};

export const DEPLOY_CONFIG_PROVIDER = 'DEPLOY_CONFIG_PROVIDER';
