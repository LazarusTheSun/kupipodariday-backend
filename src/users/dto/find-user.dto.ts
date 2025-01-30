import { IsString } from 'class-validator';

export class FindUserDTO {
  @IsString()
  field: 'username' | 'id';

  value: string | number;
}