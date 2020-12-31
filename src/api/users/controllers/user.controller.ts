/**
 * User controller.
 * ----------------
 *
 * This class handle all request to resources
 * directly related with User entitie.
 */

import { Request, Response, NextFunction } from 'express'
import { Controller, successResponse } from '../../../core'
import { httpStatus } from '../../../lib'
import { UserService } from '../services'

export class UserController extends Controller {
  constructor(
    private service: UserService = new UserService(),
  ) {
    super(service, {
      name: 'user',
      aditionalFilter: { isActive: true },
    })

    this.createAdmin = this.createAdmin.bind(this)
    this.createSuperAdmin = this.createSuperAdmin.bind(this)
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
  }

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.createAdmin(req.body)
      return successResponse(req, res, data, httpStatus.created, 'admin created')
    } catch (error) {
      next(error)
    }
  }

  async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.createSuperAdmin(req.body)
      return successResponse(req, res, data, httpStatus.created, 'super admin created')
    } catch (error) {
      next(error)
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.signup(req.body)
      return successResponse(req, res, data, httpStatus.created, 'user created')
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.login(req.body)
      return successResponse(req, res, data, httpStatus.ok, 'user logged')
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.refreshAuthToken(req.body)
      return successResponse(req, res, data, httpStatus.ok, 'token refreshed')
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data = await this.service.delete({ id })
      return successResponse(req, res, data, httpStatus.ok, 'user deleted')
    } catch (error) {
      next(error)
    }
  }
}
