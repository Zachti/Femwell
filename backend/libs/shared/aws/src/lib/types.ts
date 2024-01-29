import { ServiceCatalogClientConfig } from '@aws-sdk/client-service-catalog';

export type AWSServiceCtor = new (
  config: ServiceCatalogClientConfig | [],
) => any;

export interface serviceObject<C extends AWSServiceCtor> {
  client: C;
  options?: ConstructorParameters<C>[0];
}
export interface AWSModuleAsyncOptions<C extends AWSServiceCtor[]> {
  serviceObjects: {
    [i in keyof C]: serviceObject<C[i]>;
  };
  useFactory: (...args: any[]) => any;
  inject?: any[];
}

export interface AWSModuleOptions<C extends AWSServiceCtor[]> {
  services: {
    [i in keyof C]: serviceObject<C[i]>;
  };
}
