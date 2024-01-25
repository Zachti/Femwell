import { Injectable } from '@nestjs/common';
import { HealthIndicatorFunction } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';
import { PrismaHealthIndicator } from '../prisma/prisma.health';

@Injectable()
export class WolverineHealthIndicatorsProvider
  implements HealthIndicatorsProvider
{
  constructor(private readonly prisma: PrismaHealthIndicator) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [() => this.prisma.isHealthy()];
  }
}
