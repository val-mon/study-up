import { signToken, verifyToken } from '../../src/utils/auth.js';

// Unit tests: pure JWT helpers, no DB or network involved.

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
});

describe('auth utils (unit)', () => {
  test('signToken then verifyToken returns the original userId', () => {
    const token = signToken('507f1f77bcf86cd799439011');
    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload.userId).toBe('507f1f77bcf86cd799439011');
  });

  test('verifyToken returns null for an invalid token', () => {
    expect(verifyToken('not-a-real-token')).toBeNull();
  });
});
