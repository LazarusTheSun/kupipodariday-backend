import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDTO } from './dto/create-wish.dto';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(@Req() req, @Body() createWishDto: CreateWishDTO) {
    const wish = await this.wishesService.createWish(createWishDto, req.user.id);

    return wish;
  }
}
