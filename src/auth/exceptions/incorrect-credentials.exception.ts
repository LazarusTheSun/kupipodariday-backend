import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectCredentialsException extends HttpException {
  constructor () {
    super('incorrect username or password', HttpStatus.BAD_REQUEST);
  }
}