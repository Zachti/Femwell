import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { GqlThrottlerGuard } from './GqlThrottlerGuard'

export interface RateLimitDecoratorOptions {
  ttl?: number
  limit?: number
  errorMessage?: string
}

export const RATE_LIMIT_KEY = 'rateLimit'
export const RateLimit = (options: RateLimitDecoratorOptions) => {
  return applyDecorators(SetMetadata(RATE_LIMIT_KEY, options), UseGuards(GqlThrottlerGuard))
}
