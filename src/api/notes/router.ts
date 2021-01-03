/**
 * Note router.
 * ------------
 *
 * Handle all note endpoints.
 */

import { NoteController } from './controllers'
import { NoteCreateDTO, NoteUpdateDTO, NoteQuery } from './DTO'
import { RouterBase } from '../../core'
import { Auth, Validate, RequestLimiter } from '../../middleware'
import { scopes } from '../../auth'

export class NoteRouer extends RouterBase {
  constructor(
    private controller: NoteController = new NoteController(),
  ) {
    super('users')
    this.initializeRouter()
  }

  initializeRouter() {
    /** Create new note */
    this._router.post(
      '/',
      RequestLimiter(20),
      Auth.isAuthenticated(),
      Validate.inBody(NoteCreateDTO),
      this.controller.create,
    )

    /** List or filter from all notes */
    this._router.get(
      '/',
      Auth.isAuthenticated(), Auth.is([scopes.SUPER_ADMIN, scopes.ADMIN]),
      Validate.inQuery(NoteQuery),
      this.controller.list,
    )

    /** List or filter from all user notes */
    this._router.get(
      '/user',
      Auth.isAuthenticated(),
      Validate.inQuery(NoteQuery),
      this.controller.getAllOfUser,
    )

    /** Get a note by id */
    this._router.get(
      '/:id',
      Auth.isAuthenticated(),
      this.controller.retrieve,
    )

    /** Update a note */
    this._router.patch(
      '/:id',
      Auth.isAuthenticated(),
      Validate.inBody(NoteUpdateDTO),
      this.controller.patchOrUpdate,
    )

    /** Delete a note */
    this._router.delete(
      '/:id',
      Auth.isAuthenticated(),
      this.controller.delete,
    )
  }
}
