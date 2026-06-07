// Dummy env vars so modules that read process.env at import time (JWT, Resend)
// can load during tests. No real services are contacted.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_test_dummy';
