import { Injectable } from "@nestjs/common";
import { HealthIndicator, HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class S3HealthIndicator extends HealthIndicator {

  constructor(private readonly http: HttpHealthIndicator) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.http.pingCheck(key, process.env["AWS_S3_ENDPOINT"]!);
  }
}
