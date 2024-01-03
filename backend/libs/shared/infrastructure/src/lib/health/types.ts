import { HealthIndicatorFunction } from '@nestjs/terminus/dist/health-indicator'

export interface HealthIndicatorsProvider {
  getIndicators(): Promise<Array<HealthIndicatorFunction>>
}
