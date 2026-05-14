import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serilaize.interceptor';
import { AuthService } from 'src/users/auth.service';
import { currentUser } from 'src/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import { UpdateUserDto } from 'src/users/dtos/update-user-dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoami(@Session() session: any) {
  //   console.log(session, 'session...........');
  //   return this.userService.findOne(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  //? here i can use interceptor direct with @Request() decorator
  whoami(@currentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(dto.email, dto.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async login(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(dto.email, dto.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('Handler is running');
    const user = await this.userService.findOne(parseInt(id));

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
