/**
 * JWT class implemntation.
 * ------------------------
 *
 * Perform all actions to create and
 * validate correctly JWTs.
 */

import jwt from 'jsonwebtoken'
import config from '../config'
import { ApiError } from '../lib'
import { scopes, tokenTypes } from './constants'

export interface TokenPayload {
  email: string,
  scope: scopes,
  type?: tokenTypes,
}

export class JWT {
  static DEFAULT_EXPIRATION_TIME = '3 hours'

  static async sign(payload: TokenPayload, expiration?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        payload.type = payload.type ? payload.type : tokenTypes.AUTH
        const token = jwt.sign(payload, config.secutity.SECRET, {
          algorithm: 'HS256',
          expiresIn: expiration || this.DEFAULT_EXPIRATION_TIME,
        })
        return resolve(token)
      } catch (error) {
        return reject(error)
      }
    })
  }

  static async verify(token: string): Promise<TokenPayload> {
    return new Promise((resolve) => {
      try {
        const payload = <TokenPayload>jwt.verify(token, config.secutity.SECRET, {
          algorithms: ['HS256'],
        })
        return resolve(payload)
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          ApiError.raise.forbidden('token expired')
        }
        ApiError.raise.unauthorized()
      }
    })
  }
}
