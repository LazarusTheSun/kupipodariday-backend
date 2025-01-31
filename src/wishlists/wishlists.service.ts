import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { UpdateWishlistDTO } from './dto/update-wishlist.dto';
import { FindUserDTO } from 'src/users/dto/find-user.dto';

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

  async updateOne(updateWishlistDto: UpdateWishlistDTO, wishlistId: number, findUserDto: FindUserDTO) {
    const wishlist = await this.findOne(wishlistId);

    const user = await this.usersService.findUser(findUserDto);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('you cannot edit wishlist of another user');
    }

    const updatedWishlist = await this.wishlistsRepository.save({
      ...wishlist,
      ...updateWishlistDto
    });

    return updatedWishlist;
  }

  async deleteOne(id: number, findUserDto: FindUserDTO) {
    const wishlist = await this.findOne(id);

    const user = await this.usersService.findUser(findUserDto);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('you cannot edit wishlist of another user');
    }
    
    await this.wishlistsRepository.delete(id);

    return wishlist;
  }
}
