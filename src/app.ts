/**
 * Server APP configuration.
 * -------------------------
 *
 * This class handle all express server
 * configuration.
 * Middlewares, routes and handlers are intialized
 * by this class.
 */

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import { centralErrorHandler, notFoundHandler, requestLogger } from './middleware'
import { ApiRouter } from './core'
import { DB } from './db'
import config from './config'
import { Logger } from './lib'
import { IUserProps } from './api/users'

declare module 'express' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    user?: IUserProps
  }
}

class App {
  public app: express.Application

  constructor(routers: ApiRouter[]) {
    this.app = express()

    this.intializeDB()
    this.initializeParsers()
    this.initializeMiddlewares()
    this.initializeRouters(routers)
    this.addErrorHandling()
  }

  public getServer() {
    return this.app
  }

  public listen() {
    this.app.listen(config.app.PORT, () => {
      Logger.info(`App launching 🚀 on port: ${config.app.PORT}`)
    })
  }

  private async intializeDB() {
    await DB.connect()
  }

  private initializeRouters(routers: ApiRouter[]) {
    routers.forEach((router) => {
      this.app.use('/', router.router)
    })
  }

  private initializeParsers() {
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeMiddlewares() {
    this.app.use(requestLogger())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(mongoSanitize())
  }

  private addErrorHandling() {
    this.app.use(notFoundHandler)
    this.app.use(centralErrorHandler)
  }
}

export default App
