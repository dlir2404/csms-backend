import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminUserService } from "./manger.user.service";
import { plainToInstance } from "class-transformer";
import { CreateUserRequest, GetListUsersRequest, ListUserResponse, UserResponse } from "./user.dto";
import { ManagerAuth } from "src/shared/decorators/auth";
import { UserService } from "./user.service";

@ApiTags('Manger user')
@Controller('manager/user')
export class AdminUserController {
    constructor(
        private readonly adminUserService: AdminUserService,
        private readonly userService: UserService,
    ) {}

    @Get('all')
    @ApiResponse({
        type: ListUserResponse
    })
    @ManagerAuth()
    async getListUsers(@Query() query: GetListUsersRequest) {
        const results = await this.adminUserService.getListUsers(query);
        return plainToInstance(ListUserResponse, results);
    }

    @Post()
    @ApiResponse({
        type: UserResponse
    })
    @ManagerAuth()
    async createUser(@Body() body: CreateUserRequest) {
        const results = await this.userService.createUser(body);
        return plainToInstance(UserResponse, results);
    }
}