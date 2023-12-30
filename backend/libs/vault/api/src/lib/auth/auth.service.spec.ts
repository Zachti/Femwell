import { authConfig, AuthService } from '@backend/vault';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@backend/logger';
import { CognitoToken } from './providers/cognito.provider';



describe('AuthService', () => {
  let service: AuthService;
  let newUser: CognitoUser;
  const mockCognitoTokenProvider = {
    provide: CognitoToken,
    useValue: {
      signUp: jest.fn(() => ({ promise: jest.fn() })),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        mockCognitoTokenProvider,
        {
          provide: authConfig.KEY,
          useValue: authConfig,
        },
        {
          provide: CognitoUser,
          useValue: {
            authenticateUer: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService, AuthService>(AuthService);
    newUser = module.get<CognitoUser, CognitoUser>(CognitoUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
