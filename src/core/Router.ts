/**
 * Router base class
 * -----------------
 *
 * Abstract class of wich all routers must inherit
 */

import { Router } from 'express'

export abstract class RouterBase {
  protected _router: Router
  public path: string

  constructor(path: string, router: Router) {
    this._router = router
    this.path = path
    this.initializeRouter()
  }

  get router() {
    return this._router
  }

  initializeRouter() {}
}

export class ApiRouter extends RouterBase {
  public prefix: string
  private routers: Router[]

  constructor(config : { prefix: string, routers: Router[] }) {
    super('', Router())
    this.prefix = config.prefix
    this.routers = config.routers
    this.addRouters()
  }

  addRouters() {
    this.routers.forEach((router) => this._router.use('', router))
  }
}
