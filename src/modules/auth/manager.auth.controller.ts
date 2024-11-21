import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManagerAuthService } from "./manager.auth.service";
import { LoginRequest, LoginResponse, RegisterRequest } from "./auth.dto";
import { ManagerAuth, CurrentUserId } from "src/shared/decorators/auth";
import { plainToInstance } from 'class-transformer';
import { UserResponse } from "../user/user.dto";
import { BaseResponse } from "src/shared/types/base";

@ApiTags('Manager auth')
@Controller('auth/admin')
export class ManagerAuthController {
    constructor(private readonly managerAuthService: ManagerAuthService) {}
    @Post('register')
    @ApiResponse({
        type: BaseResponse
    })
    async register(@Body() body: RegisterRequest) {
        return this.managerAuthService.register(body);
    }

    @Post('login')
    @ApiResponse({
        type: LoginResponse
    })
    async login(@Body() body: LoginRequest) {
        return this.managerAuthService.login(body);
    }

    @Get('/me')
    @ManagerAuth()
    @ApiResponse({
        type: UserResponse
    })
    async getMe(@CurrentUserId() userId: number) {
        const user = await this.managerAuthService.getMe(userId);
        return plainToInstance(UserResponse, user);
    }
}