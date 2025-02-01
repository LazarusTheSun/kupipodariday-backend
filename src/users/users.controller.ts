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
    return await this.usersService.findUser({
      field: 'id',
      value: req.user.id,
    });
  }

  @Get('me/wishes')
  async findAuthorizedUserWishes(@Req() req) {
    return await this.usersService.findAuthorizedUserWishes(req.user.id);
  }

  @Patch('me')
  async updateAuthorizedUser(@Req() req, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.usersService.updateUser(updateUserDTO, req.user.id);
  }

  @Delete('me')
  async deleteAuthorizedUser(@Req() req) {
    return await this.usersService.deleteUser(req.user.id);
  }

  @Post('find')
  async findUsers(@Body() findUsersDto: FindUsersDTO) {
    return await this.usersService.findUsers(findUsersDto);
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username: string) {
    return await this.usersService.findUser({ field: 'username', value: username });
  }

  @Get(':username/wishes')
  async findAnotherUserWishes(@Param('username') username: string) {
    return await this.usersService.findAnotherUserWishes(username);
  }
}
