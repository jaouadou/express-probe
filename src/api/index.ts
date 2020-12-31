import { ApiRouter } from '../core'
import { UserRouter } from './users'

export const ApiRouterV1 = new ApiRouter('/api/v1', [
  new UserRouter(),
])
