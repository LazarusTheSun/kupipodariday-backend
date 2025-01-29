import { Post, Body, Controller, Req, UseGuards, Get } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
    console.log(req)
    const wishlist = await this.wishlistsService.createWishlist(createWishlistDto, req.user.id);

    return wishlist;
  }
}
