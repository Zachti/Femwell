import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerException, ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { RATE_LIMIT_KEY, RateLimitDecoratorOptions } from './rateLimit.decorator';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {

  async handleRequest(context: ExecutionContext, _limit: number, _ttl: number, throttler: ThrottlerOptions): Promise<boolean> {
    const {
      limit,
      ttl,
      errorMessage,
    } = this.reflector.getAllAndOverride<RateLimitDecoratorOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    _limit = limit?? _limit;
    _ttl = ttl?? _ttl;
    const ctx = GqlExecutionContext.create(context).getContext();
    const suffix = ctx.req.id;
    const key = this.generateKey(context, suffix, throttler.name);
    const { totalHits } = await this.storageService.increment(key, _ttl);
    if (totalHits >= _limit) {
      throw new ThrottlerException(errorMessage);
    }
    return true;
  }

  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    return { req: ctx.req, res: ctx.res };
  }
}
