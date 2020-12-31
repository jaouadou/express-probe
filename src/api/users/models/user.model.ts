/**
 * User model.
 * -----------
 */

import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUserFullDocument, IUser } from '../interfaces'
import { scopes } from '../../../auth'
import { ApiError } from '../../../lib'

/**
 * Schema
 */
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, default: '' },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: '' },
  picture: { type: String, default: '' },
  type: { type: String, enum: scopes, default: scopes.USER },
  isActive: { type: Boolean, default: false },
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.password
    },
  },
})

/**
 * Index
 */
UserSchema.index({ email: 1 })

/**
 * Virtuals
 */
UserSchema.virtual('id').get(function(this: IUserFullDocument) {
  return String(this._id)
})

UserSchema.virtual('fullName').get(function(this: IUserFullDocument) {
  return this.name + ' ' + this.lastname
})

/**
 * Methods
 */
UserSchema.methods.comparePassword = async function(password: string) {
  const match = await bcrypt.compare(password, this.password)
  return match
}

/**
 * Middlewares
 */
UserSchema.pre<IUserFullDocument>('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const saltRound = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(this.password, saltRound)
      this.password = hash
    }
    if (this.isModified('email')) {
      const db = mongoose.connection.db
      const emailExists = await db.collection('users').findOne({ email: this.email })
      if (emailExists) ApiError.raise.conflict('email already exists')
    }
    next()
  } catch (error) {
    next(error)
  }
})

export const User = mongoose.model<IUser>('User', UserSchema)
