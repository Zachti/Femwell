import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { heimdallConfig } from '../config/heimdall.config';
import { LoggerService } from '@backend/logger';
import { S3 } from '@aws-sdk/client-s3';
import { getAwsServiceToken } from '@backend/awsModule';

describe('FileService', () => {
  let fileService: FileService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: heimdallConfig.KEY,
          useValue: heimdallConfig,
        },
        {
          provide: getAwsServiceToken(S3),
          useValue: {},
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    fileService = module.get<FileService, FileService>(FileService);
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });
});
