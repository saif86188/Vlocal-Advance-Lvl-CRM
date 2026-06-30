import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return err(error.issues[0]?.message ?? 'Validation failed', 400);
  }
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return err('Unauthorized', 401);
    }
    if (error.message === 'FORBIDDEN') {
      return err('Forbidden', 403);
    }
  }
  return err('Internal server error', 500);
}
