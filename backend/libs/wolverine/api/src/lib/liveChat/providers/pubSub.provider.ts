import { Inject, Provider } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const InjectPubSubToken = () => Inject(PubSubToken);

export const PubSubToken = Symbol('PUB_SUB_TOKEN');

export const PubSubProvider: Provider = {
  provide: PubSubToken,
  useFactory: () => {
    return new PubSub();
  },
  inject: [],
};
