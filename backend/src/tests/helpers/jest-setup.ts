import 'reflect-metadata'

// Ensure minimal env for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'
process.env.JWT_EXPIRES_MINUTES = process.env.JWT_EXPIRES_MINUTES || '15'
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '60000'
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '3'


