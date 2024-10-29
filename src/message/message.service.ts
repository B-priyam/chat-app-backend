import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async sendMessage(senderId: string, chatId: string, content: string) {
    const newMessage = await this.databaseService.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        chat: { connect: { id: chatId } },
      },
      include: { sender: true },
    });

    await this.databaseService.chat.update({
      where: { id: chatId },
      data: { lastMessageId: newMessage.id },
    });

    return newMessage;
  }

  findAll() {
    return `This action returns all message`;
  }

  async getChatMessages(chatId: string) {
    const messages = await this.databaseService.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }, // Order by oldest first
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return messages;
  }
  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
