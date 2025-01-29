import { IsDate, IsOptional, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WISHLIST_DESCRIPTION_LENGTH, WISHLIST_NAME_LENGTH } from './constants';
import { User } from 'src/users/entities/users.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @CreateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(WISHLIST_NAME_LENGTH.min, WISHLIST_NAME_LENGTH.max)
  name: string;

  @Column()
  @IsOptional()
  @Length(WISHLIST_DESCRIPTION_LENGTH.min, WISHLIST_DESCRIPTION_LENGTH.max)
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, user => user.wishlists)
  owner: User;
}