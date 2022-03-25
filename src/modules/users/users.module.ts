import { Module } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/implementation/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { MailModule } from '../mail/mail.module';
import { RefreshTokenSchema } from './schemas/refresh-tokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    MailModule,
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
