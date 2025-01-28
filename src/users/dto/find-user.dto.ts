import { Length } from 'class-validator';

export class FindUserDTO {
  @Length(2, 30)
  username: string;
}