import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './controllers/links/links.controller';
import { LinkSchema } from './schemas/link.schema';
import { LinksService } from './service/links/links.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
