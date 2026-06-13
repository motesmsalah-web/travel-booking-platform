export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAuthSecret(): Uint8Array {
  const secret = getRequiredEnv('AUTH_SECRET');
  if (secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters long.');
  }
  return new TextEncoder().encode(secret);
}
