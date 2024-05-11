import { Injectable } from '@nestjs/common';
import { SNS } from '@aws-sdk/client-sns';
import { InjectAwsService } from '@backend/awsModule';
import { LoggerService } from '@backend/logger';

@Injectable()
export class NotificationService {
  constructor(
    @InjectAwsService(SNS) private readonly sns: SNS,
    private readonly logger: LoggerService,
  ) {}

  async sendNotification(topicArn: string, message: string): Promise<void> {
    this.logger.debug(`Sending notification to ${topicArn}`);
    const params = {
      Message: message,
      TopicArn: topicArn,
    };
    await this.sns.publish(params);
    this.logger.debug(`Notification sent to ${topicArn}`);
  }
}
