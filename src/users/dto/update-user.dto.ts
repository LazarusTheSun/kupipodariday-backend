import { IsEmail, IsUrl, IsOptional, Length, MaxLength } from 'class-validator'
import { USER_ABOUT_LENGTH, USER_PASSWORD_LENGTH, USERNAME_LENGTH } from '../entities/constants';

export class UpdateUserDTO {
  @Length(USERNAME_LENGTH.min, USERNAME_LENGTH.max)
  @IsOptional()
  username: string;

  @MaxLength(USER_ABOUT_LENGTH.max)
  @IsOptional()
  about: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Length(USER_PASSWORD_LENGTH.min, USER_PASSWORD_LENGTH.max)
  password: string;
}