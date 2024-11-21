import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserRequest } from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ManagerAuth } from 'src/shared/decorators/auth';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('')
  // @ManagerAuth()
  // async createUser(@Body() body: CreateUserRequest) {
  //   return this.userService.createUser(body);
  // } 
}
