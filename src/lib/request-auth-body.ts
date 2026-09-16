import type { Request, Response } from 'express';

export type RequestWithRawBody = Request & { rawBody?: Buffer };

export function captureJsonRawBody(req: Request, _res: Response, buffer: Buffer): void {
  (req as RequestWithRawBody).rawBody = Buffer.from(buffer);
}

export function getAuthenticationBody(req: Request): Buffer | undefined {
  const raw = (req as RequestWithRawBody).rawBody;
  if (Buffer.isBuffer(raw)) return raw;
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf8');
  if (req.body !== undefined && req.body !== null) return Buffer.from(JSON.stringify(req.body), 'utf8');
  return undefined;
}
