import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDTO } from './dto/create-wish.dto';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDTO } from './dto/update-wish.dto';

@UseGuards(AuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(@Req() req, @Body() createWishDto: CreateWishDTO) {
    return await this.wishesService.createWish(createWishDto, {
      field: 'id',
      value: req.user.id,
    });
  }

  @Get('last')
  async findMostRecentWishes() {
    return await this.wishesService.findMostRecentWishes();
  }

  @Get('top')
  async findTopWishes() {
    return await this.wishesService.findTopWishes();
  }

  @Post(':id/copy')
  async copyWish(@Req() req, @Param() params: any) {
    return await this.wishesService.copyWish(params.id, {
      field: 'id',
      value: req.user.id,
    });
  }

  @Get(':id')
  async findWish(@Param('id') id: number) {
    return await this.wishesService.findWish(id);
  }

  @Delete(':id')
  async deleteWish(@Req() req, @Param('id') id: number) {
    return await this.wishesService.deleteWish(id, {
      field: 'id',
      value: req.user.id,
    });
  }

  @Patch(':id')
  async updateWish(@Req() req, @Param('id') id: number, @Body() updateWishDto: UpdateWishDTO) {
    return await this.wishesService.updateWish(id, updateWishDto, { field: 'id', value: req.user.id });
  }
}
