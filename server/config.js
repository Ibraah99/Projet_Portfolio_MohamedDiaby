const dotenv = require('dotenv');

dotenv.config();

function parseOrigins(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  adminPassword:
    process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : '123'),
  jwtSecret:
    process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret-change-me'),
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS)
};

function assertRequiredConfig() {
  if (config.nodeEnv !== 'production') return;

  const required = [];
  if (!config.adminPassword) required.push('ADMIN_PASSWORD');
  if (!config.jwtSecret) required.push('JWT_SECRET');

  if (required.length > 0) {
    throw new Error(`Missing required env vars: ${required.join(', ')}`);
  }
}

module.exports = {
  config,
  assertRequiredConfig
};
