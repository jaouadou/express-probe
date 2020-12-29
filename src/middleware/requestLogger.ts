/**
 * Request logger middleware.
 * --------------------------
 *
 * Show relevant info of each request.
 */

import { Request, Response } from 'express'
import morgan from 'morgan'
import config from '../config'

export const requestLogger = () => {
  if (config.app.IS_PRODUCTION) return morgan('combined')
  return morgan((tokens, req: Request, res: Response) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res), '-',
      tokens.status(req, res), '|',
      tokens['response-time'](req, res), 'ms', '\n',
      '=> body:', JSON.stringify(req.body), '\n',
      '=> query:', JSON.stringify(req.query), '\n',
      '=> params:', JSON.stringify(req.params),
    ].join(' ')
  })
}
