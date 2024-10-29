import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { DatabaseService } from 'src/database/database.service';
import { ChatsGateway } from './chats.gateway';
import { MessageService } from 'src/message/message.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService,DatabaseService,ChatsGateway,MessageService],
})
export class ChatsModule {}
