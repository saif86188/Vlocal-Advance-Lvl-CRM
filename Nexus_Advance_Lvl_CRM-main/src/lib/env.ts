import { z } from 'zod';

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Environment validation failed: ${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getJwtSecret(): string {
  return getServerEnv().JWT_SECRET;
}
