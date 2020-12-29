/**
 * Cache response class.
 * ---------------------
 *
 * This class provide the ability to
 * store the response of some request
 * in a temporal DB served by Redis and
 * return with better performace the disired
 * response.
 */

import { redisClient } from '../db'
import { promisify } from 'util'
import { RedisClient } from 'redis'

class RedisCache {
  public time: number

  constructor(
    cacheSeconds = 60,
    private client: RedisClient = redisClient,
  ) {
    this.client = client
    this.time = cacheSeconds
  }

  getCache(key: string) {
    return promisify(this.client.get).bind(this.client)(key)
  }

  setCache(key: string, data: Record<string, any> | null) {
    return promisify(this.client.setex).bind(this.client)(key, this.time, JSON.stringify(data))
  }
}

export class Cache extends RedisCache {
  public collection: string
  constructor(collection: string, cacheSeconds: number = 60) {
    super(cacheSeconds)
    this.collection = collection
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
}
