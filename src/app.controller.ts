import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CreateUserDTO } from './users/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    return await this.usersService.create(createUserDTO);
  }
}
