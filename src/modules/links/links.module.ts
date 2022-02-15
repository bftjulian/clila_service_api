import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './controllers/links/links.controller';
import { LinkRepository } from './repositories/implementations/link.repository';
import { LinkSchema } from './schemas/link.schema';
import { LinksService } from './service/links/links.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }])],
  controllers: [LinksController],
  providers: [LinksService, LinkRepository],
})
export class LinksModule {}
