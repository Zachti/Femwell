import { Inject, Injectable } from '@nestjs/common';
import { heimdallConfig } from '../config/heimdall.config';
import { ConfigType } from '@nestjs/config';
import { InjectAwsService } from '@backend/awsModule';
import { S3 } from '@aws-sdk/client-s3';
import { LoggerService } from '@backend/logger';
import { EmailService } from '../email/email.service';

@Injectable()
export class ExporterService {
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    @InjectAwsService(S3) private s3: S3,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  private async getFileFromS3(): Promise<Buffer> {
    this.logger.info('fetching checklist from s3.');
    try {
      const { Body } = await this.s3.getObject({
        Bucket: this.heimdallCfg.awsBucket,
        Key: this.heimdallCfg.checkListKey,
      });
      if (Body) {
        const byteArr = await Body.transformToByteArray();
        return Buffer.from(byteArr);
      }
      throw new Error('No body found in the response');
    } catch (e: any) {
      this.logger.error(`Fail getting file: ${e.message}`);
      throw e;
    }
  }

  async export(userEmail: string) {
    const buffer = await this.getFileFromS3();
    this.logger.info('sending email.');
    await this.emailService.sendEmail({
      to: userEmail,
      buffer,
    });
    this.logger.info('email sent successfully.');
  }
}
