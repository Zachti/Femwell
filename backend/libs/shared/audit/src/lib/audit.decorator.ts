import { Inject } from '@nestjs/common';

export const InjectAuditService = (namespace: string) =>
  Inject(generateAuditToken(namespace));

export const generateAuditToken = (namespace: string): string => {
  return `AUDIT_TRAIL_NAMESPACE_${namespace.toUpperCase()}`;
};
