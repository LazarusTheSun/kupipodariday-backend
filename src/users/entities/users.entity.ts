import { IsDate, IsEmail, IsOptional, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DEFAULT_USER_DESCRIPTION, DEFAULT_USER_AVATART_LINK, USERNAME_LENGTH, USER_ABOUT_LENGTH, USER_PASSWORD_LENGTH } from './constants';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    unique: true,
  })
  @Length(USERNAME_LENGTH.min, USERNAME_LENGTH.max)
  username: string;

  @Column({
    default: DEFAULT_USER_DESCRIPTION
  })
  @IsOptional()
  @Length(USER_ABOUT_LENGTH.min, USER_ABOUT_LENGTH.max)
  about: string;

  @Column({
    default: DEFAULT_USER_AVATART_LINK,
  })
  avatar: string;

  @Column({
    unique: true,
  })
  @Exclude()
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @Length(USER_PASSWORD_LENGTH.min, USER_PASSWORD_LENGTH.max)
  password: string;
}