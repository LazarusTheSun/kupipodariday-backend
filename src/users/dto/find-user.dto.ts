import { IsInt, Length } from 'class-validator';
import { USERNAME_LENGTH } from '../entities/constants';

export class FindUserByUsernameDTO {
  @Length(USERNAME_LENGTH.min, USERNAME_LENGTH.max)
  username: string;
}

export class FindUserByIdDTO {
  @IsInt()
  id: number;
}