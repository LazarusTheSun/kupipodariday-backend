import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FindUsersDTO } from './dto/find-users.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { FindUserDTO } from './dto/find-user.dto';

// @todo remake methods to use queries
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private wishesService: WishesService,
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

  async findUser(findUserDto: FindUserDTO, keepPassword = false) {
    const { field, value } = findUserDto;

    const castedValue = field === 'username' ? String(value) : Number(value);

    const user = await this.usersRepository.findOne({
      where: {
        [field]: castedValue,
      }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!keepPassword) {
      delete user.password;
    }

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, userId: number) {
    const user = await this.findUser({
      field: 'id',
      value: userId,
    });

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

  async findAuthorizedUserWishes(userId: number) {
    const wishes = await this.wishesService.findWishesByUserId(userId);

    return wishes;
  }

  async findAnotherUserWishes(username: string) {
      const wishes = await this.wishesService.findWishesByUsername(username);
  
      return wishes;
  }

  async deleteUser(userId: number) {
    await this.usersRepository.delete({
      id: userId,
    });

    return {};
  }
}
