import { AWSServiceCtor } from './types';

export function getAwsServiceToken(serviceCtor: AWSServiceCtor) {
  const serviceName = (<any>serviceCtor).prototype.constructor.name;
  return `AWS_SERVICE_INSTANCE_${serviceName.toUpperCase()}`;
}
