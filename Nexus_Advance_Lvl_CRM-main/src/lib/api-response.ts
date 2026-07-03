import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function ok(data: unknown, message = 'Success', status = 200) {
  // If status is passed as the second argument (backward compatibility for some routes)
  let actualStatus = status;
  let actualMessage = message;
  if (typeof message === 'number') {
    actualStatus = message;
    actualMessage = 'Success';
  }
  return NextResponse.json(
    {
      success: true,
      data,
      message: actualMessage,
    },
    { status: actualStatus }
  );
}

export function err(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      message,
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const errorMsg = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    return err(errorMsg || 'Validation failed', 400);
  }
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return err('Unauthorized', 401);
    }
    if (error.message === 'FORBIDDEN') {
      return err('Forbidden', 403);
    }
    if (error.message === 'TOKEN_EXPIRED') {
      return err('Token expired. Please log in again.', 401);
    }
  }
  return err('Internal server error', 500);
}
