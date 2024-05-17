import { Module } from '@nestjs/common';
import { CreateDeploymentCiConfigCommand } from './create-deployment-ci-config.command';
import { AppBuilderModule } from './builders/appBuilder.module';

@Module({
  imports: [AppBuilderModule],
  providers: [CreateDeploymentCiConfigCommand],
})
export class DeploymentModule {}
