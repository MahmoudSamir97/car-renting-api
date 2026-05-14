import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //check if email is taken
    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException('Email is taken');
    //!hash password
    //a. generate the salt

    const salt = randomBytes(8).toString('hex');
    console.log(salt, 'salt');

    //b. hash the salt and password together

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //c, join hashed salt and password
    const encryptedPass = salt + '.' + hash.toString('hex');

    //create user

    const user = await this.userService.create(email, encryptedPass);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) throw new BadRequestException('No user found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('bad password');

    return user;
  }
}
