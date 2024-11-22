import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminUserController } from './manager.user.controller';
import { ManagerUserService } from './manger.user.service';

@Module({
  controllers: [UserController, AdminUserController],
  providers: [UserService, ManagerUserService],
  exports: [UserService]
})
export class UserModule {}
