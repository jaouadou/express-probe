/**
 * Data Transfer Objects: RefreshToken.
 * ------------------------------------
 *
 * Classes to represent and handle the
 * refresh token validation input.
 */

import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator'
import { IUser } from '../interfaces'

export class RefreshTokenDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: IUser['email']

  @IsString()
  @Length(64, 64)
  @IsNotEmpty()
  refreshToken!: string
}
