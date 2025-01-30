import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FindUsersDTO } from './dto/find-users.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) { }

  @Get('me')
  async getAuthorizedUser(@Req() req) {
    const user = await this.usersService.findUser({
      field: 'id',
      value: req.user.id,
    });

    return user;
  }

  // @todo maybe move user search here and then call method to search for wishes
  @Get('me/wishes')
  async findAuthorizedUserWishes(@Req() req) {
    const wishes = await this.usersService.findAuthorizedUserWishes(req.user.id);

    return wishes;
  }

  @Patch('me')
  async updateAuthorizedUser(@Req() req, @Body() updateUserDTO: UpdateUserDTO) {
    const updatedUser = await this.usersService.updateUser(updateUserDTO, req.user.id);

    return updatedUser;
  }

  @Delete('me')
  async deleteAuthorizedUser(@Req() req) {
    return await this.usersService.deleteUser(req.user.id);
  }

  @Post('find')
  async findUsers(@Body() findUsersDto: FindUsersDTO) {
    const user = await this.usersService.findUsers(findUsersDto);

    return user;
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username: string) {
    const user = await this.usersService.findUser({ field: 'username', value: username });

    return user;
  }

  @Get(':username/wishes')
  async findAnotherUserWishes(@Param('username') username: string) {
    const wishes = await this.usersService.findAnotherUserWishes(username);

    return wishes;
  }
}
