import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { UpdateWishlistDTO } from './dto/update-wishlist.dto';

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
    const user = await this.usersService.findUser({
      field: 'id',
      value: userId,
    })
    
    const wishlist = await this.wishlistsRepository.save({
      ...createWishlistDTO,
      owner: user
    });

    return wishlist;
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new NotFoundException('wishlist not found');
    }

    return wishlist;
  }

  async updateOne(updateWishlistDto: UpdateWishlistDTO, id: number) {
    const wishlist = await this.findOne(id);

    const updatedWishlist = await this.wishlistsRepository.save({
      ...wishlist,
      ...updateWishlistDto
    });

    return updatedWishlist;
  }

  async deleteOne(id: number) {
    const wishlist = await this.findOne(id);
    
    await this.wishlistsRepository.delete(id);

    return wishlist;
  }
}
