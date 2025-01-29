import { IsEmail, Length, IsOptional, IsUrl } from 'class-validator';
import { USER_ABOUT_LENGTH, USERNAME_LENGTH } from '../entities/constants';

export class CreateUserDTO {
  @Length(USERNAME_LENGTH.min, USERNAME_LENGTH.max)
  username: string;

  @IsOptional()
  @Length(USER_ABOUT_LENGTH.min, USER_ABOUT_LENGTH.max)
  about: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  avatar: string;

  @IsEmail()
  email: string;

  password: string;
}