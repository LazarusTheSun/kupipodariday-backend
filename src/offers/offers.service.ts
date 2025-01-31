import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    @Inject(forwardRef(() => WishesService)) private wishesService: WishesService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async findOffers() {
    const offers = await this.offersRepository.find();

    return offers;
  }

  async findOffer(offerId: number) {
    const offer = await this.offersRepository.findOne({
      where: {
        id: offerId
      }
    });

    if (!offer) {
      throw new NotFoundException('offer not found');
    }

    return offer;
  }

  async createOffer(userId: number, createOfferDto: CreateOfferDTO) {
    const { itemId, amount, hidden } = createOfferDto;

    const user = await this.usersService.findUser({
      field: 'id',
      value: userId
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const wish = await this.wishesService.findWish(itemId);

    if (!wish) {
      throw new NotFoundException('wish not found');
    }

    return await this.offersRepository.save({
      amount,
      hidden,
      item: wish,
      user,
    })
  }
}
