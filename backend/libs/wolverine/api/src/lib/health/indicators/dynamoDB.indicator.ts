import { Injectable } from "@nestjs/common";
import { HealthIndicator, HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class DynamoDBHealthIndicator extends HealthIndicator {

  constructor(private readonly http: HttpHealthIndicator) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.http.pingCheck(key, process.env["AWS_DYNAMO_DB_ENDPOINT"]!);
  }
}
