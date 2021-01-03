/**
 * User controller.
 * ----------------
 *
 * This class handle all request to resources
 * directly related with User entitie.
 */

import { NextFunction, Request, Response } from 'express'
import { Controller, successResponse } from '../../../core'
import { httpStatus } from '../../../lib'
import { NoteService } from '../services'

export class NoteController extends Controller {
  constructor(
    private service: NoteService = new NoteService(),
  ) {
    super(service, {
      name: 'note',
      addUserOnCreate: true,
      queryField: 'id',
      queryIn: 'params',
    })

    this.getAllOfUser = this.getAllOfUser.bind(this)
  }

  async getAllOfUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { query: queryParams } = req
      const user = req.user?.id
      const query = { user, ...queryParams }
      const data = await this.service.getMany(query)
      return successResponse(req, res, data, httpStatus.ok, 'notes retrieve')
    } catch (error) {
      next(error)
    }
  }
}
