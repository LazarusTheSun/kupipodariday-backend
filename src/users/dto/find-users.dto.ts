import { IsString } from 'class-validator';

export class FindUsersDTO {
  @IsString()
  query: string;
}