import { sendOTPSchema, addLinkSchema } from '../../src/validation/schemas.js';

// Unit tests: zod input-validation schemas, no DB or network involved.

describe('validation schemas (unit)', () => {
  test('sendOTPSchema rejects an invalid email', () => {
    const result = sendOTPSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  test('addLinkSchema accepts a valid payload and rejects a bad url', () => {
    expect(addLinkSchema.safeParse({ courseId: 'c1', label: 'Docs', url: 'https://x.com' }).success).toBe(true);
    expect(addLinkSchema.safeParse({ courseId: 'c1', label: 'Docs', url: 'notaurl' }).success).toBe(false);
  });
});
