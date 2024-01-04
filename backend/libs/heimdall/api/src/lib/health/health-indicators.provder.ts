import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorFunction, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';
import { ConfigType } from '@nestjs/config';
import { heimdallConfig } from '../config/heimdall.config';

@Injectable()
export class HeimdallHealthIndicatorsProvider
  implements HealthIndicatorsProvider
{
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    private readonly http: HttpHealthIndicator,
  ) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [() => this.http.pingCheck('s3', this.heimdallCfg.s3Endpoint!)];
  }
}
