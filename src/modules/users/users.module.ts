import { Module } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/implementation/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
