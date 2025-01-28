import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req) {
    const user = await this.usersService.findUserById(req.user.id);

    return user;
  }

  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserDTO: UpdateUserDTO) {
    const updatedUser = await this.usersService.updateUser(updateUserDTO, req.user.id);

    return updatedUser;
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username: string) {
    const user = await this.usersService.findUserByUsername(username);

    return user;
  }
}
