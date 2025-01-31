import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDTO) {
    return await this.offersService.createOffer(createOfferDto, {
      field: 'id',
      value: req.user.id,
    });
  }

  @Get()
  async findOffers() {
    const offers = await this.offersService.findOffers();

    return offers;
  }

  @Get(':id')
  async findOffer(@Param('id') id: number) {
    const offer = await this.offersService.findOffer(id);

    return offer;
  }

  @Patch(':id')
  editOffer() {
    throw new BadRequestException('you cannot update an offer');
  }
  
  @Delete(':id')
  deleteOffer() {
    throw new BadRequestException('you cannot delete an offer');
  }
}
