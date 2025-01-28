import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard as AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getAuthorizedUser(@Req() req) {
    const user = await this.usersService.findUserById(req.user.id);

    return user;
  }
}
