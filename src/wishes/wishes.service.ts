import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { Repository } from 'typeorm';
import { CreateWishDTO } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    private usersService: UsersService
  ) {}

  async createWish(createWishDto: CreateWishDTO, userId: number) {
    const user = await this.usersService.findUserById(userId);

    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });

    return wish;
  }
}
