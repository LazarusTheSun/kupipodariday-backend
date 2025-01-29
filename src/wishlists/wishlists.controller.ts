import { Post, Body, Controller, Req, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishlistDTO } from './dto/update-wishlist.dto';

@UseGuards(AuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll() {
    const wishlists = await this.wishlistsService.findAll();

    return wishlists;
  }

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDTO) {
    const wishlist = await this.wishlistsService.createWishlist(createWishlistDto, req.user.id);

    return wishlist;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlist = await this.wishlistsService.findOne(id);

    return wishlist;
  }

  @Patch(':id')
  async updateOne(@Param('id') id: number, @Body() updateWishlistDto: UpdateWishlistDTO) {
    const updatedWishlist = await this.wishlistsService.updateOne(updateWishlistDto, id);

    return updatedWishlist;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    const deletedWishlist = await this.wishlistsService.deleteOne(id);

    return deletedWishlist;
  }
}
