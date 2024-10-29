import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService,DatabaseService],
})
export class UsersModule {}
