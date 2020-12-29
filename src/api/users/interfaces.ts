/**
 * User interfaces.
 * ----------------
 */

import { Types, Document } from 'mongoose'
import { scopes } from '../../auth'

export interface IUserProps {
  _id: Types.ObjectId,
  id: string,
  name: string,
  lastname: string,
  fullName?: string,
  email: string,
  phoneNumber: string,
  picture: string,
  type: scopes,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export interface IUserDocument extends Document, IUserProps {
  _id: Types.ObjectId,
  id: string,
}

export interface IUserFullDocument extends IUserDocument {
  password: string,
}

export interface IUser extends IUserDocument {
  comparePassword(): boolean
}
