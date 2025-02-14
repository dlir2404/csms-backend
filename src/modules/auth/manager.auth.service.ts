import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRequest, RegisterRequest } from "./auth.dto";
import { User } from "src/database/models";
import { UserRole } from "src/shared/enums/user";
import * as bcrypt from 'bcrypt';
import { UserService } from "../user/user.service";

@Injectable()
export class ManagerAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {};

    async register(body: RegisterRequest) {
        return this.userService.createUser({...body, role: UserRole.MANAGER});
    }

    async login({username, password}: LoginRequest) {
        const user = await User.findOne({ where: { username: username, role: UserRole.MANAGER }});

        if (!user){
            throw new NotFoundException('Manager not found')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            throw new ForbiddenException('Username or password not match')
        }

        const payload = { sub: user.id, role: user.role };

        return { token: await this.jwtService.signAsync(payload) }
    }

    async getMe(userId: number) {
        return User.findOne({ where: { id: userId, role: UserRole.MANAGER }, raw: true})
    }
}