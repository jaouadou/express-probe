/**
 * Mongoose DB connection class
 * ----------------------------
 *
 * Mongoose class to handle connection,
 * droping and close connection operations.
 */

import mongoose from 'mongoose'
import config from '../config'
import { Logger, ErrorHandler } from '../lib'

mongoose.Promise = global.Promise

export class DB {
  static logger = new Logger('DB')

  static async connect() {
    try {
      await mongoose.connect(config.db.URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      this.logger.info('DB connected.', `Env: ${config.app.ENV}`)
    } catch (error) {
      this.logger.error('Connection error')
      ErrorHandler.handlError(error)
    }
  }

  static async drop() {
    try {
      await mongoose.connection.dropDatabase()
      this.logger.info('DB dropped')
    } catch (error) {
      this.logger.error('Dropping error:')
      ErrorHandler.handlError(error)
    }
  }

  static async close() {
    try {
      await mongoose.connection.close()
      this.logger.info('DB connection closed')
    } catch (error) {
      this.logger.error('Disconnection error:')
      ErrorHandler.handlError(error)
    }
  }
}
