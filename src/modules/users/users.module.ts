import { Module } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/implementation/user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
