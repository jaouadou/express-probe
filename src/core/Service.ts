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
import { ApiError } from '../lib'
import { Model } from 'mongoose'
import { Cache } from './Cache'
import { GenericObject, GenericDocument } from '../interfaces'

export class Service {
  public model: Model<GenericDocument>

  constructor(
    model: Model<GenericDocument>,
    private cache: Cache,
    private conf: { name: string, paginationLimit: number },
  ) {
    this.model = model
    this.cache = cache
    this.conf = conf
  }

  async getMany(reqQuery: Request['query']) {
    try {
      const { skip, limit } = this._getSkipLimit(reqQuery)
      const key = this._buildListKey(skip, limit)
      let items = await this.cache.get(key)
      if (!items) {
        items = await this.model.find(reqQuery).skip(skip).limit(limit)
        await this.cache.upsert(items, key)
      }
      const count = await this.model.count()
      return { items, count }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(query: GenericObject) {
    try {
      const key = this._buildGetKey(query)
      let item = await this.cache.get(key)
      if (!item) {
        item = await this.model.findOne(query)
        if (!item) ApiError.raise.notFound(`${this.conf.name} not found`)
        await this.cache.upsert(item, query.value)
      }
      return item
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async insert(data: GenericObject) {
    try {
      const item = await this.model.create(data)
      return item
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(data: GenericObject, query: GenericObject) {
    try {
      const item = (await this.model.findOne(query) as GenericDocument)
      if (!item) ApiError.raise.notFound(`${this.conf.name} not found`)
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) item[key] = data[key]
      })
      await item.save()
      this.cache.upsert(item.toJSON(), query.value)
      return item
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(query: GenericObject) {
    try {
      const item = await this.model.findOneAndDelete(query)
      if (item) {
        this.cache.delete(query.value)
        return null
      }
      ApiError.raise.notFound(`${this.conf.name} not found`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private _getSkipLimit(query: Request['query']) {
    const { skip: _skip, limit: _limit } = query
    const skip = _skip ? Number(_skip) : 0
    const limit = _limit ? Number(_limit) : this.conf.paginationLimit
    delete query.skip
    delete query.limit
    return { skip, limit }
  }

  private _buildListKey(skip: number, limit: number): string {
    let key = `${skip}`
    if (limit) key += `_${limit}`
    return key
  }

  private _buildGetKey(query: GenericObject): string {
    const keys: string[] = []
    Object.keys(query).forEach((_key) => keys.push(_key))
    return keys.join('_')
  }
}
