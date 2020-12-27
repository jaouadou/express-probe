/**
 * Global App configuration
 * ------------------------
 *
 * All env vars and general configuration
 * must be paced in this file inside the config
 * object.
 */

import { getOsEnv, parseToArray } from './utils'

export default {
  app: {
    PORT: getOsEnv('PORT', '3000'),
    ENV: getOsEnv('NODE_ENV'),
    IS_DEV: getOsEnv('NODE_ENV') === 'development',
    IS_PRODUCTION: getOsEnv('NODE_ENV') === 'production',
    IS_TEST: getOsEnv('NODE_ENV') === 'test',
  },
  db: {
    URL: getOsEnv('NODE_ENV') === 'test'
      ? getOsEnv('MONGO_URL_TEST')
      : getOsEnv('MONGO_URL'),
  },
  redis: {
    URL: getOsEnv('REDIS_URL'),
    HOST: getOsEnv('REDIS_HOST', ''),
    PORT: getOsEnv('REDIS_PORT', '6379'),
    PASSWORD: getOsEnv('REDIS_PASSWORD', ''),
  },
  secutity: {
    SECRET: getOsEnv('SECRET', 'devSecret'),
  },
  mailing: {
    API_KEY: getOsEnv('MAILGUN_API_KEY'),
    DOMAIN: getOsEnv('MAILGUN_DOMAIN'),
  },
}
