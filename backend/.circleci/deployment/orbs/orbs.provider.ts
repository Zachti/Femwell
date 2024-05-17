import { OrbsService } from './orbs.service';

export const orbsProvider = {
  provide: 'ORBS_PROVIDER',
  useClass: OrbsService,
};

export const ORBS_PROVIDER = 'ORBS_PROVIDER';
