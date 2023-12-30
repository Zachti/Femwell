import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { uploadConfig } from '@backend/heimdall';
import { LoggerService } from '@backend/logger';
import { s3Token } from '../providers/s3.provider';

describe('UploadService', () => {
  let uploadService: UploadService;
  const mockS3TokenProvider = {
    provide: s3Token,
    useValue: {
      upload: jest.fn(() => ({ promise: jest.fn() })),
    },
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        mockS3TokenProvider,
        {
          provide: uploadConfig.KEY,
          useValue: uploadConfig
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
          },
        }
      ],
    }).compile();

    uploadService = module.get<UploadService, UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(uploadService).toBeDefined();
  });
});
