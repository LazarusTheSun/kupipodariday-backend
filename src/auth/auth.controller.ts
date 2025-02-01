import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserAlreadyExistsException } from 'src/users/exceptions/user-already-exists.exception';
import { LocalGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    try {
      return await this.usersService.create(createUserDTO);
    } catch (err) {
      if (err.code === '23505') {
        throw new UserAlreadyExistsException();
      }
    }
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signIn(@Req() req) {
    return await this.authService.login(req.user);
  }
}