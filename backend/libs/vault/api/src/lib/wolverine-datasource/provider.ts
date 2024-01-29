import { Inject, Provider } from '@nestjs/common';
import { getSdk as getWolverineSdk } from './wolverineSdk';
import { GraphqlDatasource } from '../graphql-datasource/graphql-datasource';

export const InjectWolverineSdk = () => Inject(wolverineSdk);

export const wolverineSdk = Symbol('wolverineSdk');

export const wolverineSdkProvider: Provider = {
  provide: wolverineSdk,
  inject: ['WOLVERINE_GQL_DS'],
  useFactory: (dataSource: GraphqlDatasource) => getWolverineSdk(dataSource),
};
