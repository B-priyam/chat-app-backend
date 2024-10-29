import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { Prisma } from '@prisma/client';
import { ChatsGateway } from 'src/chats/chats.gateway';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,
    private readonly chatsGateway : ChatsGateway
  ) {}

  @Post()
  create(@Body() body: {senderId:string,chatId:string,content:string}) {
    // const message =  this.messageService.sendMessage(body.senderId,body.chatId,body.content);
    // this.chatsGateway.server.to(body.chatId).emit('newMessage',message)
    // return message
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':chatId')
  findOne(@Param('chatId') id: string) {
    return this.messageService.getChatMessages(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messageService.update(+id, updateMessageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
