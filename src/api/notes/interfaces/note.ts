/**
 * Notes interface.
 * ---------------
 */

import { Types, Document } from 'mongoose'
import { IUserProps } from '../../users'

export interface INoteProps {
  _id: Types.ObjectId,
  id: string,
  name: string,
  slug: string,
  content: string,
  tag?: string,
  user: IUserProps['_id'],
  createdAt: Date,
  updatedAt: Date,
}

export interface INoteDocument extends Document, INoteProps {
  _id: Types.ObjectId,
  id: string,
}

export interface INote extends INoteDocument { }
