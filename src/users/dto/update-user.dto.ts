import { IsEmail, IsOptional, Length } from 'class-validator'
import { USER_ABOUT_LENGTH, USER_PASSWORD_LENGTH, USERNAME_LENGTH } from '../entities/constants';

export class UpdateUserDTO {
  @Length(USERNAME_LENGTH.min, USERNAME_LENGTH.max)
  @IsOptional()
  username: string;

  @Length(USER_ABOUT_LENGTH.min, USER_ABOUT_LENGTH.max)
  @IsOptional()
  about: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Length(USER_PASSWORD_LENGTH.min, USER_PASSWORD_LENGTH.max)
  password: string;
}