import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ManagerAuthController } from './manager.auth.controller';
import { ManagerAuthService } from './manager.auth.service';

@Module({
  imports: [
    UserModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      global: true
    }),
  ],
  controllers: [AuthController, ManagerAuthController],
  providers: [AuthService, ManagerAuthService]
})
export class AuthModule {}
