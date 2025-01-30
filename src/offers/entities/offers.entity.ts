import { IsNumber } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OFFER_AMOUNT_DECIMAL_PLACES } from './constants';
import { User } from 'src/users/entities/users.entity';
import { Wish } from 'src/wishes/entities/wishes.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.offers, { eager: true, })
  user: User;

  @ManyToOne(() => Wish, item => item.offers, { eager: true, })
  item: Offer;

  @Column()
  @IsNumber({
    maxDecimalPlaces: OFFER_AMOUNT_DECIMAL_PLACES,
  })
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}