import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { Repository } from 'typeorm';
import { CreateWishDTO } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => OffersService)) private offersService: OffersService,
  ) {}

  async createWish(createWishDto: CreateWishDTO, userId: number) {
    const user = await this.usersService.findUserById(userId);

    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });

    return wish;
  }

  // @todo remake method to use queries
  async findWishes(queryKey: 'id' | 'username', value: string | number) {
    const user = queryKey === 'id'
      ? await this.usersService.findUserById(Number(value))
      : await this.usersService.findUserByUsername(String(value));

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const wishes = await this.wishesRepository.find({
      where: {
        owner: {
          id: user.id
        },
      },
    });

    return wishes;
  }

  async findWishesByUserId(id: number) {
    const wishes = await this.findWishes('id', id);

    return wishes;
  }

  async findWishesByUsername(username: string) {
    const wishes = await this.findWishes('username', username);

    return wishes;
  }

  async findWish(id: number) {
    const wish = await this.wishesRepository.findOne({ where: { id, } });

    const offers = await this.offersService.findOffers(id);

    wish.offers = offers;

    return wish;
  }
}
