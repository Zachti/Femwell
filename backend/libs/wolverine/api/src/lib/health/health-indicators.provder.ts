import { Injectable } from '@nestjs/common';
import { HealthIndicatorFunction } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';
import { DynamoDBHealthIndicator } from './indicators/dynamoDB.indicator';

@Injectable()
export class WolverineHealthIndicatorsProvider implements HealthIndicatorsProvider {
  constructor(private db: DynamoDBHealthIndicator) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [() => this.db.isHealthy('dynamoDB')]
  }
}
