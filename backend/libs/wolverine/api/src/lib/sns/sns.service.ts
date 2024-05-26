import { Injectable } from '@nestjs/common';
import { SNS } from '@aws-sdk/client-sns';
import { InjectAwsService } from '@backend/awsModule';

@Injectable()
export class NotificationService {
  constructor(@InjectAwsService(SNS) private sns: SNS) {}

  async sendNotification(topicArn: string, message: string): Promise<void> {
    const params = {
      Message: message,
      TopicArn: topicArn,
    };
    await this.sns.publish(params);
  }
}
