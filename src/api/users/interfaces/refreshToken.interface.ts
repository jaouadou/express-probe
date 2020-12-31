/**
 * RefreshToken interface.
 * -----------------------
 */

import { Types, Document } from 'mongoose'
import { IUser } from './users.iterface'

export interface ITokenProps {
  _id: Types.ObjectId,
  id: string,
  token: string,
  email: IUser['email'],
  isInvalid: boolean,
}

export interface ITokenDocument extends Document, ITokenProps {
  _id: Types.ObjectId,
  id: string,
}

export interface ITokenFullDocument extends ITokenDocument {
  password: string,
}

export interface IToken extends ITokenDocument { }
