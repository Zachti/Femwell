import { Injectable } from '@nestjs/common';
import { KnownApp } from '../types';
import { Builder } from './app-builder.interface';
import { DendenBuilder } from './ecs/denden.builder';
import { HeimdallBuilder } from './ecs/heimdall.builder';
import { VaultBuilder } from './ecs/vault.builder';
import { WolverineBuilder } from './ecs/wolverine.builder';

@Injectable()
export class AppBuilderService {
  constructor(
    private readonly wolverineBuilder: WolverineBuilder,
    private readonly DendenBuilder: DendenBuilder,
    private readonly HeimdallBuilder: HeimdallBuilder,
    private readonly VaultBuilder: VaultBuilder,
  ) {}

  appNameToBuilder(appName: KnownApp): Builder {
    switch (appName) {
      case KnownApp['wolverine']:
        return this.wolverineBuilder;
      case KnownApp['denden']:
        return this.DendenBuilder;
      case KnownApp['heimdall']:
        return this.HeimdallBuilder;
      case KnownApp['vault']:
        return this.VaultBuilder;
      default:
        throw new Error(`cannot create builder for app: ${appName}`);
    }
  }
}
