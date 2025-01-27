import { IsDate, IsEmail, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DEFAULT_USER_DESCRIPTION, DEFAULT_USER_AVATART_LINK } from './constants';
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
  @Exclude()
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  password: string;
}