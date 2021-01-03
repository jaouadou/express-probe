/**
 * Data Transfer Objects: Notes.
 * -----------------------------
 *
 * Classes to represent and handle the
 * notes validation input.
 */

import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator'

export class NoteCreateDTO {
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  name!: string

  @IsString()
  @Length(1, 5000)
  @IsNotEmpty()
  content!: string

  @IsString()
  @IsOptional()
  tag?: string
}

export class NoteOptional {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  tag?: string
}

export class NoteUpdateDTO extends NoteOptional {
  @IsString()
  @Length(1, 5000)
  @IsOptional()
  content?: string
}

export class NoteQuery extends NoteOptional {
  @IsString()
  @IsOptional()
  user?: string
}
