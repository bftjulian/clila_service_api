import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from '../links/schemas/groups.schema';
import { LinkInfosSchema } from '../links/schemas/link-infos.schema';
import { LinkSchema } from '../links/schemas/link.schema';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { GroupController } from './controllers/group/group.controller';
import { GroupRepository } from './repositories/implementations/group.repository';
import { GroupService } from './services/group/group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Link', schema: LinkSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
      { name: 'Group', schema: GroupSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export class GroupModule {}
