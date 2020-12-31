/**
 * User events actions.
 * --------------------
 *
 * Class to handle user events.
 */

import { EventEmitter } from 'events'
import { Logger } from '../../../lib'
import { IUser } from '../interfaces'
import { UserEvents } from './constants.events'

export class UserEmitter {
  constructor(
    private emmiter: EventEmitter = new EventEmitter(),
  ) {
    this.emmiter = emmiter
  }

  emmitCreated(email: IUser['email']) {
    this.emmiter.emit(UserEvents.created, email)
    this.emmiter.on(UserEvents.created, async (email: IUser['email']) => {
      Logger.info('Sending welcome email to:', email)
      // TODO: send welcome email
    })
  }
}
