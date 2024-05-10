import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '@backend/logger';
import { InjectAwsService } from '@backend/awsModule';
import { CloudFront } from '@aws-sdk/client-cloudfront';
import { dendenConfig } from '@backend/denden';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class VideoStreamService {
  constructor(
    @InjectAwsService(CloudFront) private cloudFront: CloudFront,
    @Inject(dendenConfig.KEY)
    private readonly Cfg: ConfigType<typeof dendenConfig>,
    private readonly logger: LoggerService,
  ) {}

  async stream(videoName: string): Promise<URL> {
    this.logger.info('fetching video stream url from cloudfront');
    try {
      const distribution = await this.cloudFront.getDistribution({
        Id: this.Cfg.cloudFrontDistributionId,
      });
      const domainName = distribution.Distribution?.DomainName;
      if (!domainName) throw new BadRequestException();
      this.logger.info(`video stream url fetched successfully`);
      return new URL(`https://${domainName}/${videoName}`);
    } catch (e: any) {
      this.logger.error(`video stream url not found: ${e.message}`);
      if (e instanceof BadRequestException) {
        throw new BadRequestException(
          `there is not distribution with this id: ${this.Cfg.cloudFrontDistributionId}`,
        );
      }
      throw new InternalServerErrorException(
        `video stream url not found: ${e.message}`,
      );
    }
  }
}
