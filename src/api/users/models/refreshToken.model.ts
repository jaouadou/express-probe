/**
 * Refresh Token.
 * --------------
 */

import mongoose, { Schema } from 'mongoose'
import randToken from 'rand-token'
import { ITokenFullDocument, IToken } from '../interfaces'

/**
 * Schema
 */
const RefreshTokenSchema: Schema = new Schema({
  token: { type: String, default: '', unique: true },
  email: { type: String, required: true },
  isInvalid: { type: Boolean, default: false },
})

/**
 * Index
 */
RefreshTokenSchema.index({ email: 1, token: 1 })

/**
 * Middlewares
 */
RefreshTokenSchema.pre<ITokenFullDocument>('save', function(next) {
  if (!this.token) {
    this.token = randToken.uid(64)
  }
  next()
})

export const RefreshToken = mongoose.model<IToken>('RefreshToken', RefreshTokenSchema)
