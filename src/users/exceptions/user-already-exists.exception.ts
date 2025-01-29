import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('user already exists', HttpStatus.BAD_REQUEST);
  }
}