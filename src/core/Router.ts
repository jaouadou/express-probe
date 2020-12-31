/**
 * Router base class
 * -----------------
 *
 * Abstract class of wich all routers must inherit
 */

import { Router } from 'express'
import { RequestLimiter } from '../middleware'

export abstract class RouterBase {
  protected _router: Router
  public path: string

  constructor(path: string) {
    this._router = Router()
    this.path = path
  }

  get router() {
    return this._router
  }
}

export class ApiRouter extends RouterBase {
  private routers: RouterBase[]

  constructor(prefix: string, routers: RouterBase[], config?: {
    addRequestLimiter?: boolean,
    maxRequestPerMinute?: number,
  }) {
    super(prefix)
    this.routers = routers
    if (config?.addRequestLimiter) {
      this._router.use(RequestLimiter(config.maxRequestPerMinute))
    }
    this.addRouters()
  }

  addRouters() {
    this.routers.forEach((router) => {
      this._router.use(`${this.path}/${router.path}`, router.router)
    })
  }
}
