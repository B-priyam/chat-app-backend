import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Prisma } from '@prisma/client';
import { ChatsGateway } from './chats.gateway';


@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService,
  private readonly chatsGateway: ChatsGateway
  ) {}

  @Post()
  async create(@Body() createChatDto: Prisma.ChatCreateInput ) {
    const chat = this.chatsService.create(createChatDto)
    this.chatsGateway.server.emit('chatCreated',chat)
    return chat
  }

  @Post("/getAll")
  findAll(@Body() searchData :{searchData : string}) {
    return this.chatsService.findAll(searchData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: Prisma.ChatUpdateInput) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
