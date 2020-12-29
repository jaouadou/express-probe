/**
 * Server entrypoint.
 * ------------------
 */

import App from './app'
import { ErrorHandler } from './lib'

const app = new App([])

if (require.main) {
  process.on('uncaughtException', ErrorHandler.handleFatalError)
  process.on('unhandledRejection', ErrorHandler.handleFatalError)
  app.listen()
}

const server = app.getServer()
export default server
