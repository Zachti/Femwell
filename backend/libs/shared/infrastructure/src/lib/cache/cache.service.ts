import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Milliseconds } from 'cache-manager';
import { LoggerService } from '../../../../logger/src/lib/logger.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private loggerService: LoggerService,
  ) {}

  get(key: string): Promise<string | null | undefined> {
    return this.cacheManager.get(key)
  }

  wrap<T>(key: string, fn: () => Promise<T>, ttl?: Milliseconds): Promise<T> {
    return this.cacheManager.wrap(key, fn, ttl)
  }

  async set<T>(key: string, value: T, ttl = 10_000, logger = this.loggerService): Promise<void> {
    return this.cacheManager.set(key, value, ttl).then(() => {
      logger.debug('value cached', { key, value, ttl })
    })
  }

  async del(key: string, logger = this.loggerService): Promise<void> {
    return this.cacheManager.del(key).then(() => {
      logger.debug('key deleted', { key })
    })
  }
}
