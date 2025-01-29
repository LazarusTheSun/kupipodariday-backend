import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private wishlistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
  ) {}

  async findAll() {
    const wishlists = await this.wishlistsRepository.find();

    return wishlists;
  } 

  async createWishlist(createWishlistDTO: CreateWishlistDTO, userId: number) {
    const user = await this.usersService.findUserById(userId);
    
    const wishlist = await this.wishlistsRepository.save({
      ...createWishlistDTO,
      owner: user
    });

    return wishlist;
  }
}
