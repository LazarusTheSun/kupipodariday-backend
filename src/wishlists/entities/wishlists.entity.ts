import { IsDate, Length, IsUrl } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WISHLIST_NAME_LENGTH } from './constants';
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
  @IsUrl({
    require_protocol: true,
  })
  image: string;

  @ManyToOne(() => User, user => user.wishlists)
  owner: User;
}