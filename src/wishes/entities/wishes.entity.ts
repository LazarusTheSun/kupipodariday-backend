import { IsNumber, Length, IsUrl } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WISH_DESCRIPTION_LENGTH, WISH_MONEY_DECIMALS_PLACES, WISH_NAME_LENGTH } from './constants';
import { User } from 'src/users/entities/users.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(WISH_NAME_LENGTH.min, WISH_NAME_LENGTH.max)
  name: string;

  @Column()
  @IsUrl({
    require_protocol: true,
  })
  link: string;

  @Column()
  @IsUrl({
    require_protocol: true,
  })
  image: string;

  @Column()
  @IsNumber({
    maxDecimalPlaces: WISH_MONEY_DECIMALS_PLACES,
  })
  price: number;

  @Column({
    default: 0,
  })
  @IsNumber({
    maxDecimalPlaces: WISH_MONEY_DECIMALS_PLACES
  })
  raised: number;

  @Column()
  @Length(WISH_DESCRIPTION_LENGTH.min, WISH_DESCRIPTION_LENGTH.max)
  description: string;

  @ManyToOne(() => User, user => user.wishes)
  owner: User;

  @Column({
    default: 0,
  })
  copied: number;
}