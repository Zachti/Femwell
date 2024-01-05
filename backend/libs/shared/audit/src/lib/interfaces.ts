export type AuditEventTrigger = {
  id: { type: string; value: string };
  type: string;
};

export interface AuditEventSubject {
  type: string;
  id: string;
  event: {
    type: string;
    metaData?: Record<string, any>;
  };
}

export interface AuditEventInput {
  timestamp?: Date;
  trigger: AuditEventTrigger;
  subject: AuditEventSubject;
  metaData?: {
    context?: {
      requestId?: string;
    };
  };
}

export type AuditEvent = Omit<AuditEventInput, 'timestamp'> & {
  timestamp: string;
  id: string;
  namespace: string;
};
