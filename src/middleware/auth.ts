/**
 * Authentication middleware.
 * --------------------------
 *
 * Validate request autentication and authorization
 * permissions.
 */

import { Request, Response, NextFunction } from 'express'
import { IUserProps, User } from '../api/users'
import { JWT, scopes, tokenTypes } from '../auth'
import { ApiError } from '../lib'
import { RequesDataLocation } from '../interfaces'

const getTokenFromHeader = (req: Request) => {
  const authorization = req.headers && req.headers.authorization
  if (authorization) {
    try {
      const token = authorization.split('Bearer ')[1]
      return token
    } catch (error) {
      ApiError.raise.unauthorized()
    }
  }
  ApiError.raise.unauthorized()
}

export class Auth {
  static isAuthenticated() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = getTokenFromHeader(req) || ''
        const payload = await JWT.verify(token)
        if (payload.type === tokenTypes.AUTH) {
          const user: IUserProps = await User.findOne({ email: payload.email }).lean()
          if (user) {
            req.user = user
            return next()
          }
        }
        ApiError.raise.unauthorized('invalid credentials')
      } catch (error) {
        return next(error)
      }
    }
  }

  static is(userType: scopes | scopes[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        let types: scopes[]
        if (typeof userType === 'string') {
          types = [userType]
        } else {
          types = [...userType]
        }
        if (types.includes(req.user?.type as scopes)) return next()
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }

  private static _isOwner(
    req: Request,
    field:string = 'id',
    where: RequesDataLocation,
  ) {
    const userIdentifier = req[where][field]
    return userIdentifier === req.user?.id
  }

  static isOwner(field: string = 'id', where: RequesDataLocation) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (this._isOwner(req, field, where)) return next()
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }

  static isOwnerOrSatff(field: string = 'id', where: RequesDataLocation) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const type = req.user?.type
        const isOwner = this._isOwner(req, field, where)
        const isAdminOrSuperAdmin = type === scopes.ADMIN || type === scopes.SUPER_ADMIN
        if (isOwner || isAdminOrSuperAdmin) return next()
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }

  static isOwnerOrSuperAdmin(field: string = 'id', where: RequesDataLocation) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (this._isOwner(req, field, where) || req.user?.type === scopes.SUPER_ADMIN) {
          return next()
        }
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }
}
