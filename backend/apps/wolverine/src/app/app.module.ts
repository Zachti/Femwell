import { Module } from '@nestjs/common';
import { LoggerModule } from '@backend/logger';
import { awsConfigObject, DynamicConfigModule } from '@backend/config';
@Module({
  imports: [
    LoggerModule.forRoot({ serviceName: 'wolverine' }),
    DynamicConfigModule.forRoot({
      isGlobal: true,
      configObjects: [wolverineConfigObject, awsConfigObject],
      validationOptions: { presence: 'required' },
    }),],
  providers: [],
})
export class WolverineCoreModule {}
