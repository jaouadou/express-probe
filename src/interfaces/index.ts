/**
 * Generic interfaces.
 * -------------------
 */

import { Document } from 'mongoose'

export type RequesDataLocation = 'query' | 'params' | 'body'

export type GenericObject = Record<string, any>

export interface GenericDocument extends Document, GenericObject {}
