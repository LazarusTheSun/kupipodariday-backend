import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), UsersModule],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule { }
