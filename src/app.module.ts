import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseService } from './database/database.service';
import { ChatsModule } from './chats/chats.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UsersModule, ChatsModule, DatabaseModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
