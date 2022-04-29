import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { UserRepository } from '../users/repositories/implementation/user.repository';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { GroupController } from './controllers/group/group.controller';
import { LinksController } from './controllers/links/links.controller';
import { linksEventListeners } from './events/listeners';
import { GroupRepository } from './repositories/implementations/group.repository';
import { HashRepository } from './repositories/implementations/hash.repository';
import { LinkRepository } from './repositories/implementations/link.repository';
import { GroupSchema } from './schemas/groups.schema';
import { HashSchema } from './schemas/hash.schema';
import { LinkInfosSchema } from './schemas/link-infos.schema';
import { LinkSchema } from './schemas/link.schema';
import { GroupService } from './service/group/group.service';
import { LinksService } from './service/links/links.service';
import { linksTasks } from './tasks';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Link', schema: LinkSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
      { name: 'Group', schema: GroupSchema },
      { name: 'Hash', schema: HashSchema },
    ]),
    SharedModule,
  ],
  controllers: [LinksController, GroupController],
  providers: [
    GroupService,
    LinksService,
    GroupRepository,
    LinkRepository,
    UserRepository,
    HashRepository,
    ...linksTasks,
    ...linksEventListeners,
  ],
})
export class LinksModule {}
