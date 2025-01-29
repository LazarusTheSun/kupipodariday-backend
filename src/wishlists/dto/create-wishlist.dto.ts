import { Length } from 'class-validator';
import { WISHLIST_NAME_LENGTH } from '../entities/constants';

export class CreateWishlistDTO {
  @Length(WISHLIST_NAME_LENGTH.min, WISHLIST_NAME_LENGTH.max)
  name: string;

  image: string;
}