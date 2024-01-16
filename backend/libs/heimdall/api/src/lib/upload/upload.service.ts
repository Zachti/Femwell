import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { heimdallConfig } from '../config/heimdall.config';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { UploadFile, UploadResult } from '../inetrfaces/interfaces';
import { LoggerService } from '@backend/logger';
import { InjectAwsService } from '@backend/awsModule';

@Injectable()
export class UploadService {
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    @InjectAwsService(S3) private s3: S3,
    private readonly logger: LoggerService,
  ) {}

  async upload(file: UploadFile, username: string): Promise<UploadResult> {
    const keyName = `${this.heimdallCfg.baseFolderLocation}/${username}/${file.key}`;
    this.logger.info('uploading file to s3.');
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.heimdallCfg.awsBucket,
          Key: keyName,
          Body: file.data,
          ContentType: file.mimeType,
        }),
      );
    } catch (e: any) {
      this.logger.error(`Fail uploading file: ${e.message}`);
      throw new InternalServerErrorException(e, 'Fail uploading file');
    }
    this.logger.info('file uploaded successfully.');
    return {
      type: file.mimeType,
      id: `${username}/${file.key}`,
      error: 0,
    } as UploadResult;
  }
}
