import { IsEmail, Length, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  password: string;
}