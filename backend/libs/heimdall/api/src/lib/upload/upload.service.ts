import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { uploadConfig } from '@backend/heimdall';
import { S3 } from 'aws-sdk';
import { InjectS3Token } from '../providers/s3.provider';
import { uploadFile, uploadResult } from '../inetrfaces/interfaces';
import { randomUUID } from 'node:crypto';
import { LoggerService } from '@backend/logger';

@Injectable()
export class UploadService {
  constructor(
    @Inject(uploadConfig.KEY)
    private readonly uploadCfg: ConfigType<typeof uploadConfig>,
    @InjectS3Token() private s3: S3,
    private readonly logger: LoggerService,
  ) {}

  async upload(file: uploadFile): Promise<uploadResult> {
    const imagesFolder = randomUUID();
    const keyName = `${this.uploadCfg.baseFolderLocation}/${imagesFolder}/${file.key}`;
    this.logger.info('uploading file to s3.');
    const result = this.s3
      .upload({
        Bucket: this.uploadCfg.awsBucket,
        Key: keyName,
        Body: file.data,
        ContentType: file.mimeType,
      } as S3.Types.PutObjectRequest)
      .promise();
    try {
      await Promise.resolve(result)
    }catch (e: any){
      this.logger.error(`Fail uploading file: ${e.message}`)
      throw new InternalServerErrorException(e, 'Fail uploading file')
    }
    this.logger.info('file uploaded successfully.');
    return {
      type: file.mimeType,
      id: `${imagesFolder}/${file.key}`,
      error: 0,
    } as uploadResult;
  }
}
