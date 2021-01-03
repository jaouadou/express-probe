/**
 * Note service.
 * -------------
 *
 * This class handle all bussines logic
 * directly related with Note entitie.
 */

import { Model } from 'mongoose'
import { Note } from '../models'
import { INote } from '../interfaces'
import { Cache } from '../../../services/cache'
import { Service } from '../../../core'

export class NoteService extends Service {
  constructor(
    private model: Model<INote> = Note,
    cache: Cache = new Cache('notes'),
  ) {
    super(model, cache, { name: 'note', checkOwner: true, ownerRef: 'user' })
  }
}
