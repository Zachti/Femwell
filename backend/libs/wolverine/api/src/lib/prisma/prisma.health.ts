import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prismaService: PrismaService) {
    super();
  }
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = await this.prismaService['$queryRaw']`SELECT 1`
      .then(() => true)
      .catch(() => false);

    const result = this.getStatus('prisma', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('prisma dead', result);
  }
}
