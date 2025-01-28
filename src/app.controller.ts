import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDTO } from './users/dto/create-user.dto';
import { LocalGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.create(createUserDTO);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }
}
