import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { DataSource, In, MoreThan, Repository } from 'typeorm';
import { CreateWishDTO } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';
import { FindUserDTO } from 'src/users/dto/find-user.dto';
import { UpdateWishDTO } from './dto/update-wish.dto';
import { User } from 'src/users/entities/users.entity';
import { Offer } from 'src/offers/entities/offers.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) { }

  async createWish(createWishDto: CreateWishDTO, findUserDto: FindUserDTO) {
    const user = await this.usersService.findUser(findUserDto);

    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });

    return wish;
  }

  async findWishesByIds(ids: number[]) {
    const wishes = await this.wishesRepository.find({
      where: {
        id: In(ids)
      }
    });

    return wishes;
  }

  async findWishes(findUserDto: FindUserDTO) {
    const user = await this.usersService.findUser(findUserDto);

    const wishes = await this.wishesRepository.find({
      where: {
        owner: {
          id: user.id
        },
      },
    });

    return wishes;
  }

  async findMostRecentWishes() {
    const wishes = await this.wishesRepository.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      }
    });

    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.wishesRepository.find({
      take: 20,
      order: {
        copied: 'DESC',
      },
      where: {
        copied: MoreThan(0),
      }
    });

    return wishes;
  }

  async findWish(wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId
      },
      relations: {
        offers: true,
      }
    });

    if (!wish) {
      throw new NotFoundException('wish not found');
    }

    return wish;
  }

  async updateWish(wishId: number, updateWishDto: UpdateWishDTO, findUserDto: FindUserDTO) {
    const wish = await this.findWish(wishId);
    const user = await this.usersService.findUser(findUserDto);

    this.checkWish(wish, user, 'update');

    const updatedWish = this.wishesRepository.save({
      ...wish,
      ...updateWishDto,
    });

    return updatedWish;
  }

  async deleteWish(wishId: number, findUserDto: FindUserDTO) {
    const wish = await this.findWish(wishId);
    const user = await this.usersService.findUser(findUserDto);

    this.checkWish(wish, user, 'delete');

    await this.wishesRepository.delete(wishId);

    return {}
  }

  checkWish(wish: Wish, user: User, method: 'delete' | 'update') {
    if (user.id !== wish.owner.id) {
      throw new ForbiddenException(`you cannot ${method} a wish of another user`);
    }

    if (wish?.raised > 0) {
      throw new BadRequestException(`you cannot ${method} a wish with some money already raised`);
    }
  }

  async copyWish(wishId: number, findUserDto: FindUserDTO) {
    const existingWish = await this.findWish(wishId);
    const { name, description, link, image, price } = existingWish;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.incrementSourceWishCopy(existingWish),
        this.createWish({ name, description, link, image, price }, findUserDto),
      ]);

      await queryRunner.commitTransaction();
    } catch (_) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {}
  }

  async incrementSourceWishCopy(wish: Wish) {
    await this.wishesRepository.save({
      ...wish,
      copied: wish.copied + 1
    })
  }

  async calcMoneyRaised(wishId: number) {
    const wish = await this.findWish(wishId);

    const moneyRaised = wish.offers.reduce((acc: number, offer: Offer) => acc + offer.amount, 0);

    return {
      moneyRaised,
      wishId,
    };
  }

  async setRaisedMoney(wishId: number, raisedMoney: number) {
    const wish = await this.findWish(wishId);

    await this.wishesRepository.save({
      ...wish,
      raised: raisedMoney,
    });
  }
}
