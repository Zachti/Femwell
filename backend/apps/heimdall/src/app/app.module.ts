import { Module } from '@nestjs/common';
import { UploadModule } from '@backend/heimdall';
import { LoggerModule } from '@backend/logger';
import { DynamicConfigModule } from '@backend/config';
import { uploadConfigObject } from '@backend/heimdall';

@Module({
  imports: [
    UploadModule,
    LoggerModule.forRoot({ serviceName: 'heimdall' }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [uploadConfigObject],
      validationOptions: { presence: 'required' },
    }),

  ],
})
export class HeimdallCoreModule {}
