import { IsBoolean, IsInt, IsNumber } from 'class-validator';
import { OFFER_AMOUNT_DECIMAL_PLACES } from '../entities/constants';

export class CreateOfferDTO {
  @IsInt()
  itemId: number; 

  @IsBoolean()
  hidden: boolean;

  @IsNumber({
    maxDecimalPlaces: OFFER_AMOUNT_DECIMAL_PLACES,
  })
  amount: number;
}