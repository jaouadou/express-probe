/**
 * Generic Controller class.
 * ----------------------
 *
 * All controller classes must be inherit
 * from it.
 * This class perform the basic CRUD operation
 * with the configuration set in the constructor.
 */

import { Request, Response, NextFunction } from 'express'
import { GenericObject, RequesDataLocation } from '../interfaces'
import { httpStatus } from '../lib'
import { Service } from './Service'
import { successResponse } from './response'

interface controllerOptions {
  name: string,
  queryField?: string,
  queryIn?: RequesDataLocation,
  addUserOnCreate?: boolean,
  aditionalFilter?: GenericObject,
}

export class Controller {
  public queryField: string
  public queryIn: RequesDataLocation
  public name: string
  public addUserOnCreate: boolean
  public filter: GenericObject

  constructor(
    public _service: Service,
    options: controllerOptions,
  ) {
    this._service = _service
    this.name = options.name
    this.queryField = options.queryField || 'id'
    this.queryIn = options.queryIn || 'params'
    this.addUserOnCreate = options.addUserOnCreate || false
    this.filter = options.aditionalFilter || {}

    this.list = this.list.bind(this)
    this.retrieve = this.retrieve.bind(this)
    this.create = this.create.bind(this)
    this.patchOrUpdate = this.patchOrUpdate.bind(this)
    this.delete = this.delete.bind(this)
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req
      const data = await this._service.getMany({ ...query, ...this.filter })
      return successResponse(req, res, data, httpStatus.ok, `${this.name}s retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async retrieve(req: Request, res: Response, next: NextFunction) {
    try {
      const query = this._getQueryFilter(req)
      const data = await this._service.getOne({ ...query, ...this.filter })
      return successResponse(req, res, data, httpStatus.ok, `${this.name} retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      let { body: DTO } = req
      if (this.addUserOnCreate) {
        const { user } = req
        DTO = { ...DTO, user: user?._id }
      }
      const data = await this._service.insert(DTO)
      return successResponse(req, res, data, httpStatus.created, `${this.name} created`)
    } catch (error) {
      return next(error)
    }
  }

  async patchOrUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { body: DTO } = req
      const query = this._getQueryFilter(req)
      const data = await this._service.update(DTO, { ...query, ...this.filter })
      return successResponse(req, res, data, httpStatus.ok, `${this.name} updated`)
    } catch (error) {
      return next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const query = this._getQueryFilter(req)
      await this._service.delete(query)
      return successResponse(req, res, {}, httpStatus.ok, `${this.name} deleted`)
    } catch (error) {
      return next(error)
    }
  }

  _getQueryFilter(
    req: Request,
    queryField: string = this.queryField,
    queryIn: RequesDataLocation = this.queryIn,
  ) {
    const field = queryField
    const pkValue = req[queryIn][field]
    return { [field]: pkValue }
  }
}
