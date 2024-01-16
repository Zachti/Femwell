import { Inject } from '@nestjs/common';
import { AWSServiceCtor } from './types';
import { getAwsServiceToken } from './tokens';

export const InjectAwsService = (serviceCtor: AWSServiceCtor) => {
  return Inject(getAwsServiceToken(serviceCtor));
};
