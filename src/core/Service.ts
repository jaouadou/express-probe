/**
 * Generic Service class.
 * ----------------------
 *
 * All services classes must be inherit
 * from it.
 * This class perform the basic CRUD operation
 * with the configuration set in the constructor.
 */

import { Request } from 'express'
import { Model, Types } from 'mongoose'
import { ApiError, Logger } from '../lib'
import { GenericObject, GenericDocument } from '../interfaces'
import { Cache } from '../services/cache'
import config from '../config'

export class Service {
  private _model: Model<any>
  public name: string
  private paginationLimit: number
  public logger: Logger

  constructor(
    model: Model<any>,
    protected cache: Cache,
    conf: { name: string, paginationLimit?: number },
  ) {
    this._model = model
    this.cache = cache
    this.logger = new Logger(conf.name)
    this.name = conf.name
    this.paginationLimit = conf.paginationLimit || config.api.DEFAULT_PAGINATION_LIMIT
  }

  async getMany(reqQuery: Request['query']) {
    try {
      const { skip, limit } = this._getSkipLimit(reqQuery)
      const key = this._buildListKey(skip, limit)
      let items = await this.cache.get(key)
      if (!items) {
        items = await this._model.find(reqQuery).skip(skip).limit(limit)
        await this.cache.upsert(items, key)
      }
      const count = await this._model.count()
      return { items, count }
    } catch (error) {
      this.logger.error(`Error on list ${this.name}s`, error)
      return Promise.reject(error)
    }
  }

  async getOne(query: GenericObject) {
    try {
      const _query = this._parseQuery(query)
      const key = this._buildGetKey(_query)
      let item = await this.cache.get(key)
      if (!item) {
        item = await this._model.findOne(_query)
        if (!item) ApiError.raise.notFound(`${this.name} not found`)
        await this.cache.upsert(item, key)
      }
      return item
    } catch (error) {
      this.logger.error(`Error on get ${this.name}`, error)
      return Promise.reject(error)
    }
  }

  async insert(data: GenericObject) {
    try {
      const item = await this._model.create(data)
      return item
    } catch (error) {
      this.logger.error(`Error on insert ${this.name}`, error)
      return Promise.reject(error)
    }
  }

  async update(data: GenericObject, query: GenericObject) {
    try {
      const _query = this._parseQuery(query)
      const item = (await this._model.findOne(_query) as GenericDocument)
      if (!item) ApiError.raise.notFound(`${this.name} not found`)
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) item[key] = data[key]
      })
      await item.save()
      this.cache.upsert(item.toJSON(), this._buildGetKey(query))
      return item
    } catch (error) {
      this.logger.error(`Error on update ${this.name}`, error)
      return Promise.reject(error)
    }
  }

  async delete(query: GenericObject) {
    try {
      const _query = this._parseQuery(query)
      const item = await this._model.findOneAndDelete(_query)
      if (item) {
        this.cache.delete(query.value)
        return null
      }
      ApiError.raise.notFound(`${this.name} not found`)
    } catch (error) {
      this.logger.error(`Error on delete ${this.name}`, error)
      return Promise.reject(error)
    }
  }

  private _getSkipLimit(query: Request['query']) {
    const { skip: _skip, limit: _limit } = query
    const skip = _skip ? Number(_skip) : 0
    const limit = _limit ? Number(_limit) : this.paginationLimit
    delete query.skip
    delete query.limit
    return { skip, limit }
  }

  protected _parseQuery(query: GenericObject) {
    // eslint-disable-next-line no-prototype-builtins
    if (query.hasOwnProperty('id')) {
      query._id = Types.ObjectId(query.id)
      delete query.id
    }
    return query
  }

  protected _buildListKey(skip: number, limit: number): string {
    let key = `${skip}`
    if (limit) key += `_${limit}`
    return key
  }

  protected _buildGetKey(query: GenericObject): string {
    const keys: string[] = []
    Object.keys(query).forEach((_key) => keys.push(_key))
    return keys.join('_')
  }
}
