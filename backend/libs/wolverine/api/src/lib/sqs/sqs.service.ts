import { Inject, Injectable } from '@nestjs/common';
import { SQS } from '@aws-sdk/client-sqs';
import { InjectAwsService } from '@backend/awsModule';
import { wolverineConfig } from '../config/wolverine.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SqsService {
  constructor(
    @InjectAwsService(SQS) private sqs: SQS,
    @Inject(wolverineConfig.KEY)
    private readonly Cfg: ConfigType<typeof wolverineConfig>,
  ) {}

  async sendMessage(message: string): Promise<void> {
    const params = {
      QueueUrl: this.Cfg.queueUrl,
      MessageBody: message,
    };
    await this.sqs.sendMessage(params);
  }
}
