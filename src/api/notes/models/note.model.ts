/**
 * Notes model.
 * ------------
 */

import mongoose, { Schema } from 'mongoose'
import { INoteDocument, INote } from '../interfaces'
import { sluglify } from '../../../utils'

/**
 * Schema
 */
const NoteSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  content: { type: String, required: true },
  tag: { type: String, default: '' },
  user: { type: String, ref: 'User' },
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.__v
    },
  },
})

/**
 * Index
 */
NoteSchema.index({ name: 1, user: 1 })

/**
 * Virtuals
 */
NoteSchema.virtual('id').get(function(this: INoteDocument) {
  return String(this._id)
})

/**
 * Middlewares
 */
NoteSchema.pre<INoteDocument>('save', async function(next) {
  try {
    if (!this.slug) {
      this.slug = await sluglify(this.name)
    }
    next()
  } catch (error) {
    next(error)
  }
})

export const Note = mongoose.model<INote>('Note', NoteSchema)
