import { Injectable } from '@nestjs/common';
import { HealthIndicatorFunction } from '@nestjs/terminus';
import { S3HealthIndicator } from './indicators/s3.indicator';
import { HealthIndicatorsProvider } from '@backend/infrastructure';

@Injectable()
export class HeimdallHealthIndicatorsProvider implements HealthIndicatorsProvider {
  constructor(private s3: S3HealthIndicator) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [() => this.s3.isHealthy('s3')]
  }
}
