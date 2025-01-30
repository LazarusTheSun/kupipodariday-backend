import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FindUsersDTO } from './dto/find-users.dto';

// @todo remake methods to use queries
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  async create(createUserDTO: CreateUserDTO) {
    const { password } = createUserDTO;

    return bcrypt.hash(password, 10)
      .then(hashedPassword => {
        createUserDTO.password = hashedPassword;

        const user = this.usersRepository.create(createUserDTO);

        return this.usersRepository.save(user);
      })
  }

  async findUsers(findUsersDto: FindUsersDTO) {
    const { query } = findUsersDto;

    const users = await this.usersRepository.find({
      where: [
        { username: query },
        { email: query }
      ]
    });

    return users;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, userId: number) {
    const user = await this.findUserById(userId);

    if (updateUserDTO.password !== undefined) {
      await bcrypt.hash(updateUserDTO.password, 10)
        .then(hashedPassword => {
          updateUserDTO.password = hashedPassword;
        })
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDTO
    });

    delete updatedUser.password;

    return updatedUser;
  }
}
