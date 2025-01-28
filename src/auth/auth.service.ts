import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({username});

    return bcrypt.compare(password, user.password)
      .then(arePaswordsMatched => {
        if (arePaswordsMatched) {
          const { password, ...result } = user;

          return result;
        }

        return null;
      })
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(
        payload,
        { 
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: '10m',
        }
      )
    }
  }
}
