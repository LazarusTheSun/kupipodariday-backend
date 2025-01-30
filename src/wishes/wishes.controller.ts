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
    const wish = await this.wishesService.createWish(createWishDto, {
      field: 'id',
      value: req.user.id,
    });

    return wish;
  }

  @Get(':id')
  async findWish(@Param('id') id: number) {
    const wish = await this.wishesService.findWish(id);

    return wish;
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
    const updatedWish = await this.wishesService.updateWish(id, updateWishDto, { field: 'id', value: req.user.id });

    return updatedWish;
  }

  @Post(':id/copy')
  async copyWish(@Req() req, @Param(':id') id: number) {
    const copiedWish = await this.wishesService.copyWish(id, {
      field: 'id',
      value: req.user.id,
    });

    return copiedWish;
  }
}
