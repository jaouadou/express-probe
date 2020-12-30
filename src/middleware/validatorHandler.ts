/**
 * Request validation handler.
 * ---------------------------
 *
 * Middleware to handle the request input validation.
 */

import { Request, Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { GenericObject, RequesDataLocation } from '../interfaces'
import { ApiError, Logger } from '../lib'

export class Validate {
  static inParams(type: any, skipMissing = false) {
    return this.validateIn(type, 'params', skipMissing)
  }

  static inQuery(type: any, skipMissing = false) {
    return this.validateIn(type, 'query', skipMissing)
  }

  static inBody(type: any, skipMissing = false) {
    return this.validateIn(type, 'body', skipMissing)
  }

  private static validateIn(type: any, where: RequesDataLocation = 'body', skipMissing = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req[where]
        const toValidate = plainToClass(type, data)

        const errors: ValidationError[] = await validate(toValidate, {
          skipMissingProperties: skipMissing,
          forbidUnknownValues: true,
          forbidNonWhitelisted: true,
          whitelist: true,
        })

        if (errors.length === 0) return next()
        this.checkIfExtraFields(errors, req)
        ApiError.raise.badRequest('bad request', this.parseError(errors))
      } catch (error) {
        return next(error)
      }
    }
  }

  private static parseError(errors: ValidationError[]) {
    return errors.map((error) => ({
      property: error.property,
      errors: Object.values(error.constraints as GenericObject),
    }))
  }

  private static checkIfExtraFields(errors: ValidationError[], req: Request) {
    const extraFields = errors.map((error) => {
      if (error.constraints?.whitelistValidation) return true
      return false
    }).filter((extreField) => extreField)

    if (extraFields.length) {
      Logger.error(`${req.ip} try to make invalid request`)
    }
  }
}
