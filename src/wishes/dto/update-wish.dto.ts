import { IsNumber, Length, IsUrl } from 'class-validator';
import { WISH_DESCRIPTION_LENGTH, WISH_MONEY_DECIMALS_PLACES, WISH_NAME_LENGTH } from 'src/wishes/entities/constants';

export class UpdateWishDTO {
  @Length(WISH_NAME_LENGTH.min, WISH_NAME_LENGTH.max)
  name: string;

  @IsUrl({
    require_protocol: true,
  })
  link: string;

  @IsUrl({
    require_protocol: true,
  })
  image: string;

  @IsNumber({
    maxDecimalPlaces: WISH_MONEY_DECIMALS_PLACES,
  })
  price: number;

  @Length(WISH_DESCRIPTION_LENGTH.min, WISH_DESCRIPTION_LENGTH.max)
  description: string;
}