import { Module } from '@nestjs/common';
import { sharedProviders } from './providers';

@Module({
  providers: [...sharedProviders],
  exports: [...sharedProviders],
})
export class SharedModule {}
