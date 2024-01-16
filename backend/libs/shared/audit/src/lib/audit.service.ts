import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import {
  AuditModuleFeatureOptions,
  AuditModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './audit-module.definitions';
import { LoggerService } from '@backend/logger';
import { AUDIT_STORE_PROVIDER } from './constants';
import { Buffer } from './buffer';
import { AuditEvent, AuditEventInput } from './interfaces';
import { randomUUID } from 'node:crypto';
import { Kinesis, PutRecordsRequestEntry } from '@aws-sdk/client-kinesis';

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  readonly store: Kinesis;
  readonly #flushIntervalMS: number;
  private readonly maxBufferSize: number;
  private timer?: NodeJS.Timeout;
  private eventsBuffer: Buffer<AuditEvent>;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: AuditModuleOptions,
    private readonly logger: LoggerService,
    @Inject(AUDIT_STORE_PROVIDER) private readonly _store: Kinesis,
    @Optional() private readonly featureOptions?: AuditModuleFeatureOptions,
  ) {
    this.store = _store;
    this.eventsBuffer = new Buffer();
    this.maxBufferSize = options.maxBufferSize ?? 10;
    this.#flushIntervalMS = options.flushIntervalMS ?? 60000;
  }
  async auditEvent(input: AuditEventInput): Promise<string> {
    const event: AuditEvent = this.auditInputToAuditEvent(input);
    this.eventsBuffer.add(event);
    if (this.eventsBuffer.size >= this.maxBufferSize) {
      await this.flushEvents('buffer is full');
    }
    return event.id;
  }

  private auditInputToAuditEvent(input: AuditEventInput): AuditEvent {
    return {
      ...input,
      id: randomUUID(),
      namespace: this?.featureOptions?.namespace ?? 'audit-events',
      timestamp: input.timestamp
        ? input.timestamp.toISOString()
        : new Date().toISOString(),
      metaData: {
        context: {
          requestId: input.metaData?.context?.requestId ?? undefined,
        },
      },
    };
  }

  private eventToStoreEntry(event: AuditEvent): PutRecordsRequestEntry {
    return {
      Data: new TextEncoder().encode(JSON.stringify(event)),
      PartitionKey: this?.featureOptions?.namespace ?? 'audit-events',
    };
  }

  private async flushEvents(flushReason: string): Promise<void> {
    if (this.eventsBuffer.isEmpty) return;
    this.logger.debug(`saving ${this.eventsBuffer.size} events in store`, {
      eventsToSave: this.eventsBuffer
        .getAll()
        .map(this.eventToEventDescription),
      flushReason,
    });
    const putStart = Date.now();
    const res = await this.store.putRecords({
      Records: this.eventsBuffer.getAll().map(this.eventToStoreEntry),
      StreamARN: this.options.streamARN,
    });
    const putDurationMS = Date.now() - putStart;
    const savedEventsCount = res.Records?.filter((r) => r.SequenceNumber)
      .length;
    this.logger.debug(`${savedEventsCount} audit events stored successfully`, {
      flushReason,
      putDurationMS,
    });
    if (res.FailedRecordCount !== 0) {
      this.logger.error(
        `${res.FailedRecordCount} audit events failed to be stored in the stream`,
        {
          flushReason,
          putDurationMS,
        },
      );
      // TODO handle errors - insert the fail records back to the buffer
    }
    this.eventsBuffer.reset();
  }

  private startAutoFlush() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(async () => {
      if (!this.eventsBuffer.isEmpty) {
        await this.flushEvents('flushTimer hit');
      }
    }, this.#flushIntervalMS);
  }

  private stopAutoFlush() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private eventToEventDescription(event: AuditEvent): string {
    return `(${event.namespace}): ${event.subject.type} ${event.subject.id} : ${event.subject.event.type} by ${event.trigger.type} trigger: ${event.trigger.id.value} (${event.trigger.id.type})`;
  }

  onModuleInit(): void {
    this.logger.debug('Audit module initiated', {
      options: { bufferMaxSize: this.maxBufferSize },
    });
    this.startAutoFlush();
  }

  onModuleDestroy(): Promise<void> {
    this.stopAutoFlush();
    if (!this.eventsBuffer.isEmpty) {
      this.logger.debug(
        `audit module destroyed. flushing ${this.eventsBuffer.size} remaining events`,
      );
      return this.flushEvents('module destroyed');
    }
    return Promise.resolve();
  }
}
