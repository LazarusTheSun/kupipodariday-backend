import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FindUsersDTO } from './dto/find-users.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { FindUserDTO } from './dto/find-user.dto';

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

  async findUser(findUserDto: FindUserDTO, selectColumns = { password: false,  email: false, }) {
    const { field, value } = findUserDto;

    const castedValue = field === 'username' ? String(value) : Number(value);

    const user = await this.usersRepository.findOne({
      where: {
        [field]: castedValue,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
        ...selectColumns,
      },
      relations: {
        offers: true,
        wishes: true,
        wishlists: true,
      }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, userId: number) {
    const user = await this.findUser({
      field: 'id',
      value: userId,
    });

    if (updateUserDTO?.email !== undefined) {
      const isUserExists = await this.usersRepository.existsBy({email: updateUserDTO.email});

      if (isUserExists) {
        throw new BadRequestException('user with given email already exists');
      }
    }

    if (updateUserDTO?.username !== undefined) {
      const isUserExists = await this.usersRepository.existsBy({username: updateUserDTO.username});

      if (isUserExists) {
        throw new BadRequestException('user with given username already exists');
      }
    }

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
    const wishes = await this.wishesService.findWishes({
      field: 'id',
      value: userId,
    });

    return wishes;
  }

  async findAnotherUserWishes(username: string) {
      const wishes = await this.wishesService.findWishes({
        field: 'username',
        value: username,
      });
  
      return wishes;
  }

  async deleteUser(userId: number) {
    await this.usersRepository.delete({
      id: userId,
    });

    return {};
  }
}
