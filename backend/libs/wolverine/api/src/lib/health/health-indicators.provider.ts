import { Injectable } from '@nestjs/common';
import { HealthIndicatorFunction, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthIndicatorsProvider } from '@backend/infrastructure';

@Injectable()
export class WolverineHealthIndicatorsProvider
  implements HealthIndicatorsProvider
{
  constructor(private readonly http: HttpHealthIndicator) {}

  async getIndicators(): Promise<Array<HealthIndicatorFunction>> {
    return [
      // () =>
      //   this.http.pingCheck('aurora', process.env['AWS_AURORA_URL'] as string),
    ];
  }
}
