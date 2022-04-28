import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../users/repositories/implementation/user.repository';
import { RefreshTokenSchema } from '../users/schemas/refresh-tokens.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { LinksController } from './controllers/links/links.controller';
import { LinkRepository } from './repositories/implementations/link.repository';
import { GroupSchema } from './schemas/groups.schema';
import { LinkInfosSchema } from './schemas/link-infos.schema';
import { LinkSchema } from './schemas/link.schema';
import { LinksService } from './service/links/links.service';

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
  controllers: [LinksController],
  providers: [LinksService, LinkRepository, UserRepository],
})
export class LinksModule {}
