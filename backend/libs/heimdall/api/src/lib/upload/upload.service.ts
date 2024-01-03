import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { heimdallConfig } from '@backend/heimdall';
import { S3 } from 'aws-sdk';
import { InjectS3Token } from '../providers/s3.provider';
import { UploadFile, UploadResult } from '../inetrfaces/interfaces';
import { LoggerService } from '@backend/logger';

@Injectable()
export class UploadService {
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    @InjectS3Token() private s3: S3,
    private readonly logger: LoggerService,
  ) {}

  async upload(file: UploadFile, username: string): Promise<UploadResult> {
    const keyName = `${this.heimdallCfg.baseFolderLocation}/${username}/${file.key}`;
    this.logger.info('uploading file to s3.');
    const result = this.s3
      .upload({
        Bucket: this.heimdallCfg.awsBucket,
        Key: keyName,
        Body: file.data,
        ContentType: file.mimeType,
      } as S3.Types.PutObjectRequest)
      .promise();
    try {
      await Promise.resolve(result);
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
