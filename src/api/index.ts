import { ApiRouter } from '../core'
import { UserRouter } from './users'
import { NoteRouer } from './notes'

export const ApiRouterV1 = new ApiRouter('/api/v1', [
  new UserRouter(),
  new NoteRouer(),
],
{
  addRequestLimiter: true,
})
