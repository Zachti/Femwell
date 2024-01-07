import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorFunction, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';
import { ConfigType } from '@nestjs/config';
import { dendenConfig } from '../config/denden.config';

@Injectable()
export class DendenHealthIndicatorsProvider
  implements HealthIndicatorsProvider
{
  constructor(
    @Inject(dendenConfig.KEY)
    private readonly dendenCfg: ConfigType<typeof dendenConfig>,
    private readonly http: HttpHealthIndicator,
  ) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [
      () =>
        this.http.pingCheck('cloudFront', this.dendenCfg.cloudFrontEndpoint!),
    ];
  }
}
