import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HEALTH_INDICATORS_PROVIDER } from './constants';
import { HealthIndicatorsProvider } from './types';

@Controller('health')
export class HealthController {

  constructor(
    private readonly health: HealthCheckService,
              @Inject(HEALTH_INDICATORS_PROVIDER) private readonly indicatorsProvider: HealthIndicatorsProvider
  ) {
  }
  @Get()
  @HealthCheck()
  async check() {
    const indicators = await this.indicatorsProvider.getIndicators()
    return this.health.check(indicators)
  }
}
