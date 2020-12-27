/**
 * Security constants.
 * -------------------
 *
 */

/* eslint-disable no-unused-vars */

export enum scopes {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

export enum tokenTypes {
  AUTH = 'AUTH',
  MAIL = 'MAIL',
  PASSWORD_RECOVERY = 'PASSWORD',
}
