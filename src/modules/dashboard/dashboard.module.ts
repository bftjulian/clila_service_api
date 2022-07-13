import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { LinkSchema } from '../links/schemas/link.schema';
import { GroupSchema } from '../links/schemas/groups.schema';
import { DashboardGateway } from './gateways/dashboard.gateway';
import { LinkInfosSchema } from '../links/schemas/link-infos.schema';
import { DashboardService } from './services/dashboard/dashboard.service';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { AuthenticateService } from './services/authenticate/authenticate.service';
import { UserRepository } from '../users/repositories/implementation/user.repository';
import { LinkRepository } from '../links/repositories/implementations/link.repository';
import { DashboardRepository } from './repositories/implementations/dashboard.repository';
import { CacheDataRepository } from './repositories/implementations/cache-data.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Link', schema: LinkSchema },
      { name: 'Group', schema: GroupSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    UserRepository,
    LinkRepository,
    DashboardGateway,
    DashboardService,
    DashboardRepository,
    CacheDataRepository,
    AuthenticateService,
  ],
})
export class DashboardModule {}
