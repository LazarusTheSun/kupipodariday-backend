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
    return await this.wishlistsService.findAll();
  }

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDTO) {
    return await this.wishlistsService.createWishlist(createWishlistDto, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async updateOne(@Req() req, @Param('id') id: number, @Body() updateWishlistDto: UpdateWishlistDTO) {
    return await this.wishlistsService.updateOne(updateWishlistDto, id, {
      field: 'id',
      value: req.user.id,
    });
  }

  @Delete(':id')
  async deleteOne(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.deleteOne(id, {
      field: 'id',
      value: req.user.id,
    });
  }
}
