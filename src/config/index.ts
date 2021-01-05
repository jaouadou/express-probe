/**
 * Global App configuration
 * ------------------------
 *
 * All env vars and general configuration
 * must be paced in this file inside the config
 * object.
 */

import * as path from 'path'
import dotenv from 'dotenv'
import { getOsEnv } from './utils'
import { parseToBool } from '../utils'

dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
})

export default {
  app: {
    PORT: getOsEnv('PORT', '3000'),
    ENV: getOsEnv('NODE_ENV'),
    IS_DEV: getOsEnv('NODE_ENV') === 'development',
    IS_PRODUCTION: getOsEnv('NODE_ENV') === 'production',
    IS_TEST: getOsEnv('NODE_ENV') === 'test',
  },
  api: {
    CACHE_SECONDS: Number(getOsEnv('CACHE_SECONDS', '20')),
    DEFAULT_PAGINATION_LIMIT: Number(getOsEnv('DEFAULT_PAGINATION_LIMIT', '50')),
    CACHE_REQUESTS: parseToBool(getOsEnv('CACHE_REQUESTS', 'false')),
    MAX_REQUEST_PER_MINUTE: Number(getOsEnv('MAX_REQUEST_PER_MINUTE', '60')),
  },
  db: {
    URL: getOsEnv('NODE_ENV') === 'test'
      ? getOsEnv('MONGO_URL_TEST')
      : getOsEnv('MONGO_URL'),
  },
  redis: {
    URL: getOsEnv('REDIS_URL'),
    HOST: getOsEnv('REDIS_HOST', 'localhost'),
    PORT: getOsEnv('REDIS_PORT', '6379'),
    PASSWORD: getOsEnv('REDIS_PASSWORD', 'redis'),
  },
  secutity: {
    SECRET: getOsEnv('SECRET', 'devSecret'),
  },
  mailing: {
    API_KEY: getOsEnv('MAILGUN_API_KEY'),
    DOMAIN: getOsEnv('MAILGUN_DOMAIN'),
    FROM_EMAIL: getOsEnv('MAILGUN_DOMAIN', 'example@samples.mailgun.org'),
    FROM_EMAIL_NAME: getOsEnv('FROM_EMAIL_NAME', 'My App'),
  },
}
