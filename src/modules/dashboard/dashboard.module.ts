import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardTasker } from './tasks/dashboard.task';
import { SharedModule } from '../../shared/shared.module';
import { UserSchema } from '../users/schemas/user.schema';
import { LinkSchema } from '../links/schemas/link.schema';
import { ReadService } from './services/read/read.service';
import { LoadService } from './services/load/load.service';
import { GroupSchema } from '../links/schemas/groups.schema';
import { DashboardGateway } from './gateways/dashboard.gateway';
import { VerifyService } from './services/verify/verify.service';
import { LinkInfosSchema } from '../links/schemas/link-infos.schema';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { UserRepository } from '../users/repositories/implementation/user.repository';
import { LinkRepository } from '../links/repositories/implementations/link.repository';
import { DashboardRepository } from './repositories/implementations/dashboard.repository';
import { DashboardIncrementerProvider } from './providers/dashboard-incrementer.provider';
import { CacheDataRepository } from './repositories/implementations/cache-data.repository';
import { EmitService } from './services/emit/emit.service';
@Module({
  imports: [
    SharedModule,
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
    EmitService,
    ReadService,
    LoadService,
    VerifyService,
    DashboardTasker,
    UserRepository,
    LinkRepository,
    DashboardGateway,
    CacheDataRepository,
    DashboardRepository,
    DashboardIncrementerProvider,
    EmitService,
  ],
  exports: [LoadService, DashboardIncrementerProvider],
})
export class DashboardModule {}
