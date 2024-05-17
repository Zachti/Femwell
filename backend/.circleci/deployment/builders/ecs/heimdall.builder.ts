import { Injectable } from '@nestjs/common';
import { KnownApp } from '../../types';
import { ECSBuilder } from './ecs-builder';

@Injectable()
export class HeimdallBuilder extends ECSBuilder {
  appName = KnownApp['heimdall'];
}
