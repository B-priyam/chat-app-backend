import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseService } from 'src/database/database.service';
import { ChatsGateway } from 'src/chats/chats.gateway';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService,DatabaseService,ChatsGateway,ChatsService],
})
export class MessageModule {}
