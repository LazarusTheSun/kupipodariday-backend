import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserDTO } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const { password } = createUserDTO;

    return bcrypt.hash(password, 10)
      .then(hashedPassword => {
        createUserDTO.password = hashedPassword;

        const user = this.usersRepository.create(createUserDTO);

        return this.usersRepository.save(user);
      })
  }

  findOne(findUserDTO: FindUserDTO) {
    const user = this.usersRepository.findOneBy(findUserDTO);

    return user;
  }
}
