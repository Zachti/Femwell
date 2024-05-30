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
export class FileService {
  constructor(
    @Inject(heimdallConfig.KEY)
    private readonly heimdallCfg: ConfigType<typeof heimdallConfig>,
    @InjectAwsService(S3) private s3: S3,
    private readonly logger: LoggerService,
  ) {}

  async upload(file: UploadFile, filePath: string): Promise<UploadResult> {
    const keyName = `${filePath}/${file.key}`;
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
      id: keyName,
      error: 0,
    } as UploadResult;
  }

  async delete(userId: string, prefix: string): Promise<void> {
    this.logger.info(
      `Initiating file deletion for the post associated with user ID: ${userId}.`,
    );
    try {
      const { Contents } = await this.s3.listObjectsV2({
        Bucket: this.heimdallCfg.awsBucket,
        Prefix: prefix,
      });
      if (!Contents) {
        this.logger.info('No files found for the given post.');
        return;
      }
      await this.s3.deleteObjects({
        Bucket: this.heimdallCfg.awsBucket,
        Delete: {
          Objects: Contents.map((obj) => ({ Key: obj.Key })),
        },
      });
    } catch (e: any) {
      this.logger.error(`Fail deleting file: ${e.message}`);
      throw new InternalServerErrorException(e, 'Fail deleting file');
    }
    this.logger.info('file deleted successfully.');
  }
}
