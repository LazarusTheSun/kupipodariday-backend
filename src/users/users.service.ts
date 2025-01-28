import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserByUsernameDTO, FindUserByIdDTO } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';

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

  async findUserByUsername(findUserDTO: FindUserByUsernameDTO) {
    const user = await this.usersRepository.findOneBy(findUserDTO);

    return user;
  }

  async findUserById(findUserDTO: FindUserByIdDTO) {
    const user = await this.usersRepository.findOneBy(findUserDTO);

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, userId: FindUserByIdDTO) {
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
