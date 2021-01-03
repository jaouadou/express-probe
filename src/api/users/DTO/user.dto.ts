/**
 * Data Transfer Objects: User.
 * ----------------------------
 *
 * Classes to represent and handle the
 * user validation input.
 */

import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  IsOptional,
} from 'class-validator'

export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @Length(6, 100)
  @IsNotEmpty()
  password!: string
}

export class UserSignupDTO extends UserLoginDTO {
  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  name!: string

  @IsString()
  @Length(2, 100)
  @IsOptional()
  lastname?: string

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phoneNumber!: string
}

export class UsertCreateDTO extends UserSignupDTO { }

export class UserUpdateDTO {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string

  @IsString()
  @Length(2, 100)
  @IsOptional()
  lastname?: string

  @IsPhoneNumber(null)
  @IsOptional()
  pohoneNumber?: string

  @IsString()
  @IsOptional()
  picture?: string
}
