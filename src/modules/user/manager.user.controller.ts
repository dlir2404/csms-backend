import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManagerUserService } from "./manger.user.service";
import { plainToInstance } from "class-transformer";
import { CreateUserRequest, EditUserRequest, GetListUsersRequest, ListUserResponse, UserResponse } from "./user.dto";
import { ManagerAuth } from "src/shared/decorators/auth";
import { UserService } from "./user.service";
import { BaseResponse } from "src/shared/types/base";

@ApiTags('Manger user')
@Controller('manager/user')
export class AdminUserController {
    constructor(
        private readonly managerUserService: ManagerUserService,
        private readonly userService: UserService,
    ) {}

    @Get('all')
    @ApiResponse({
        type: ListUserResponse
    })
    @ManagerAuth()
    async getListUsers(@Query() query: GetListUsersRequest) {
        const results = await this.managerUserService.getListUsers(query);
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

    @Put(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async editUser(@Param('id') id: number, @Body() body: EditUserRequest) {
        const results = await this.managerUserService.updateUser(id, body);
        return plainToInstance(BaseResponse, results);
    }

    @Delete(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    //potential bug
    async deleteUser(@Param('id') id: number) {
        const results = await this.managerUserService.deleteUser(id);
        return plainToInstance(BaseResponse, results);
    }
}