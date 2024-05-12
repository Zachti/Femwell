import { Inject, Injectable } from '@nestjs/common';
import { heimdallConfig } from '../config/heimdall.config';
import { ConfigType } from '@nestjs/config';
import { InjectAwsService } from '@backend/awsModule';
import { SES, SendRawEmailCommandOutput } from '@aws-sdk/client-ses';
import { LoggerService } from '@backend/logger';
import { Email } from '../inetrfaces/interfaces';

@Injectable()
export class EmailService {
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    @InjectAwsService(SES) private ses: SES,
    private readonly logger: LoggerService,
  ) {}

  async sendEmail(email: Email): Promise<SendRawEmailCommandOutput> {
    this.logger.info('sending email.');
    try {
      const headers =
        `Content-Type: application/pdf\r\n` +
        `From: Admin <${this.heimdallCfg.supportEmail}>\r\n` +
        `To: ${email.to}\r\n` +
        `Subject: check list\r\n\r\n`;

      const emailContent = headers + email.buffer.toString();

      const res = await this.ses.sendRawEmail({
        Source: this.heimdallCfg.supportEmail,
        Destinations: [email.to],
        RawMessage: { Data: new Uint8Array(Buffer.from(emailContent)) },
      });
      this.logger.debug('email sent.', { res });
      return res;
    } catch (e: any) {
      this.logger.error(`Fail sending email: ${e.message}`);
      throw e;
    }
  }
}
