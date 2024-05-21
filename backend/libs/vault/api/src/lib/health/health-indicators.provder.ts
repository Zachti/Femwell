import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorFunction, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';
import { ConfigType } from '@nestjs/config';
import { vaultConfig } from '../config/vaultConfig';

@Injectable()
export class VaultHealthIndicatorsProvider implements HealthIndicatorsProvider {
  constructor(
    @Inject(vaultConfig.KEY)
    private readonly vaultCfg: ConfigType<typeof vaultConfig>,
    private readonly http: HttpHealthIndicator,
  ) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [
      // () =>
      //   this.http.pingCheck(
      //     'wolverine',
      //     this.vaultCfg.wolverineGraphqlEndpoint,
      //   ),
    ];
  }
}
