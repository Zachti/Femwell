import { ServiceCatalogClientConfig } from '@aws-sdk/client-service-catalog';

export type AWSServiceCtor = new (
  config: ServiceCatalogClientConfig | [],
) => any;

export interface serviceObject<C extends AWSServiceCtor> {
  client: C;
  options?: ConstructorParameters<C>[0];
}
export interface AWSModuleAsyncOptions<C extends AWSServiceCtor> {
  serviceObjects: serviceObject<C>;
  useFactory: (...args: any[]) => ServiceCatalogClientConfig;
  inject?: any[];
}

export interface AWSModuleOptions<C extends AWSServiceCtor> {
  services: Array<serviceObject<C>>;
}
