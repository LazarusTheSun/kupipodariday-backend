import { IsDate, IsEmail, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DEFAULT_USER_DESCRIPTION, DEFAULT_USER_AVATART_LINK } from './constants';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  createAt: Date;

  @Column()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(2, 30)
  username: string;

  @Column({
    default: DEFAULT_USER_DESCRIPTION
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: DEFAULT_USER_AVATART_LINK,
  })
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;
}