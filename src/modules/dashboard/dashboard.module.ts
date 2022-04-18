import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkRepository } from '../links/repositories/implementations/link.repository';
import { LinkInfosSchema } from '../links/schemas/link-infos.schema';
import { LinkSchema } from '../links/schemas/link.schema';
import { UserRepository } from '../users/repositories/implementation/user.repository';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { DashboardService } from './services/dashboard/dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Link', schema: LinkSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, LinkRepository, UserRepository],
})
export class DashboardModule {}
