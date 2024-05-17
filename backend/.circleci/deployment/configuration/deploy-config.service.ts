import { Injectable, Logger } from '@nestjs/common';
import { DeploymentVariablesConfig } from './deployment-config';
import { deploymentConfigDev } from './deployment-config.dev';
import { deploymentConfigMain } from './deployment-config.main';
import { DeploymentEnv } from './types';

@Injectable()
export class DeployConfigService {
  private readonly logger = new Logger(DeployConfigService.name);
  private _config!: DeploymentVariablesConfig;
  private _deployEnv!: DeploymentEnv;
  initializeConfigVariables(deploymentEnv: DeploymentEnv): void {
    if (!deploymentEnv) {
      throw new Error(`invalid deploymentEnv "${deploymentEnv}"`);
    }
    const config =
      deploymentEnv === DeploymentEnv.Development
        ? deploymentConfigDev
        : deploymentConfigMain;
    this.logger.debug(
      `initializing configuration variables for provided deploymentEnv: ${deploymentEnv}`,
      { config },
    );
    this._deployEnv = deploymentEnv;
    this._config = config;
  }

  get config(): DeploymentVariablesConfig {
    return this._config;
  }

  get deployEnv(): DeploymentEnv {
    return this._deployEnv;
  }
}
