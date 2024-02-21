import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { heimdallConfig } from '../config/heimdall.config';
import { LoggerService } from '@backend/logger';

describe('UploadService', () => {
  let uploadService: UploadService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: heimdallConfig.KEY,
          useValue: heimdallConfig,
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    uploadService = module.get<UploadService, UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(uploadService).toBeDefined();
  });
});
