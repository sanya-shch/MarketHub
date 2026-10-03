/**
 * Prisma error codes are checked structurally (not with `instanceof`), which
 * keeps working when two copies of @prisma/client end up in a bundle / monorepo.
 */
const hasCode = (error: unknown, code: string) =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: unknown }).code === code;

/** P2002: a unique constraint failed (e.g. a second review of the same product). */
export const isUniqueViolation = (error: unknown) => hasCode(error, 'P2002');
