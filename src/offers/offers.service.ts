import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FindUserDTO } from 'src/users/dto/find-user.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    @Inject(forwardRef(() => WishesService)) private wishesService: WishesService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) { }

  async findOffers() {
    return await this.offersRepository.find();
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

  async createOffer(createOfferDto: CreateOfferDTO, findUserDto: FindUserDTO) {
    const { itemId, amount, hidden } = createOfferDto;

    const user = await this.usersService.findUser(findUserDto);
    const wish = await this.wishesService.findWish(itemId);

    if (user.id === wish.owner.id) {
      throw new BadRequestException('you cannot make an offer to yourself');
    }

    await this.offersRepository.save({
      amount,
      hidden,
      item: wish,
      user,
    });

    const {moneyRaised, wishId} = await this.wishesService.calcMoneyRaised(itemId);
    await this.wishesService.setRaisedMoney(wishId, moneyRaised);

    return {};
  }
}
