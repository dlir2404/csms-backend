import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequest, LoginResponse, RegisterRequest } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthRequired, CurrentUserId } from 'src/shared/decorators/auth';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '../user/user.dto';
import { BaseResponse } from 'src/shared/types/base';
import { UserRole } from 'src/shared/enums/user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {};
    // @Post('register')
    // @ApiResponse({
    //     type: BaseResponse
    // })
    // async register(@Body() body: RegisterRequest) {
    //     return this.authService.register(body);
    // }

    @Post('login')
    @ApiResponse({
        type: LoginResponse
    })
    async login(@Body() body: LoginRequest) {
        return this.authService.login(body);
    }
    
    @Get('/me')
    @AuthRequired([UserRole.BARISTA, UserRole.ORDER_TAKER])
    @ApiResponse({
        type: UserResponse
    })
    async getMe(@CurrentUserId() userId: number): Promise<UserResponse>{
        const user = await this.authService.getMe(userId);
        return plainToInstance(UserResponse, user);
    }
}
