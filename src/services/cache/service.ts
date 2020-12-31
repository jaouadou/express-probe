/**
 * Cache response class.
 * ---------------------
 *
 * This class provide the ability to
 * store the response of some request
 * in a temporal DB served by Redis and
 * return with better performace the disired
 * response.
 *
 * The cache service always must be to expose
 * at minimun 3 expected methods:
 * - list -> Get cached response of array info
 * - get -> Get cached response of single object info
 * - upsert -> Update or insert new info to cache
 */

import { RedisClient } from 'redis'
import { promisify } from 'util'
import { cacheClient } from './client'
import config from '../../config'

export class Cache {
  public collection: string
  private time: number
  private client: RedisClient

  constructor(collection: string, conf?: {
    client?: RedisClient,
    cacheSeconds?: number,
  }) {
    this.collection = collection
    this.time = conf?.cacheSeconds || config.api.CACHE_SECONDS
    this.client = conf?.client || cacheClient
  }

  async list(key: string = this.collection) {
    const data = await this.getCache(key)
    return data ? JSON.parse(data) : null
  }

  async get(key: string) {
    const _key = `${this.collection}_${key}`
    return await this.list(_key)
  }

  async upsert(data: Record<string, any>, key?: string) {
    let _key = this.collection
    if (key) _key = _key += `_${key}`
    else {
      const id = data.id ? data.id : data._id
      _key += `_${id}`
    }
    return await this.setCache(_key, data)
  }

  async delete(key?: string) {
    const _key = key ? `${this.collection}_${key}` : this.collection
    this.setCache(_key, null)
  }

  private getCache(key: string) {
    return promisify(this.client.get).bind(this.client)(key)
  }

  private setCache(key: string, data: Record<string, any> | null) {
    return promisify(this.client.setex).bind(this.client)(key, this.time, JSON.stringify(data))
  }
}
