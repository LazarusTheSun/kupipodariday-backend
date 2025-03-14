import { IsDate, IsEmail, IsUrl, IsOptional, Length, MaxLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DEFAULT_USER_DESCRIPTION, DEFAULT_USER_AVATART_LINK, USERNAME_LENGTH, USER_ABOUT_LENGTH, USER_PASSWORD_LENGTH } from './constants';
import { Wishlist } from 'src/wishlists/entities/wishlists.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { Offer } from 'src/offers/entities/offers.entity';

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
  @MaxLength(USER_ABOUT_LENGTH.max)
  about: string;

  @Column({
    default: DEFAULT_USER_AVATART_LINK,
  })
  @IsUrl({
    require_protocol: true,
  })
  avatar: string;

  @Column({
    unique: true,
    select: false,
  })
  @IsEmail()
  email: string;

  @Column({
    select: false,
  })
  @Length(USER_PASSWORD_LENGTH.min, USER_PASSWORD_LENGTH.max)
  password: string;

  @OneToMany(() => Wishlist, wishlist => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Wish, wish => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, offer => offer.user)
  offers: Offer[];
}