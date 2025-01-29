import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDTO } from './users/dto/create-user.dto';
import { LocalGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserAlreadyExistsException } from './users/exceptions/user-already-exists.exception';

@Controller()
export class AppController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    try {
      const user = await this.usersService.create(createUserDTO);

      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new UserAlreadyExistsException();
      }
    }
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return await this.authService.login(req.user);
  }
}
