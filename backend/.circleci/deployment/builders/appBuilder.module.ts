import { Module } from '@nestjs/common';
import { AppBuilderService } from './appBuilder.service';
import { orbsProvider } from '../orbs/orbs.provider';
import { deployConfigProvider } from '../configuration/deploy-config.provider';
import { DendenBuilder } from './ecs/denden.builder';
import { HeimdallBuilder } from './ecs/heimdall.builder';
import { VaultBuilder } from './ecs/vault.builder';
import { WolverineBuilder } from './ecs/wolverine.builder';

@Module({
  providers: [
    WolverineBuilder,
    DendenBuilder,
    HeimdallBuilder,
    VaultBuilder,
    orbsProvider,
    deployConfigProvider,
  ],
  exports: [AppBuilderService, deployConfigProvider, orbsProvider],
})
export class AppBuilderModule {}
