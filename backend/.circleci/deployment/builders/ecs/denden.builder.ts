import { Injectable } from '@nestjs/common';
import { KnownApp } from '../../types';
import { ECSBuilder } from './ecs-builder';

@Injectable()
export class DendenBuilder extends ECSBuilder {
  appName = KnownApp['denden'];
}
