/**
 * Server entrypoint.
 * ------------------
 */

import App from './app'
import { ErrorHandler } from './lib'
import { ApiRouterV1 } from './api'

const app = new App([
  ApiRouterV1,
])

if (require.main) {
  process.on('uncaughtException', ErrorHandler.handleFatalError)
  process.on('unhandledRejection', ErrorHandler.handleFatalError)
  app.listen()
}

const server = app.getServer()
export default server
