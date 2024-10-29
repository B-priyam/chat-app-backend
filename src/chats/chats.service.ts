import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatsService {
  constructor (private readonly databaseService : DatabaseService){}

  async create(createChatDto: Prisma.ChatCreateInput) {
    const { users, isGroup, ...chatData } = createChatDto;

    const existingChat = await this.databaseService.chat.findFirst({
      where: {
        isGroup: false,
        users: {
          every: {
            id: {
              in: [users[0],users[1]],
            },
          },
        },
      },
    });

    if (existingChat) {
      console.log("chat already exists")
      return existingChat;
    }

    if (!Array.isArray(users)) {
      throw new Error("Users must be an array");
    }
    // Step 1: Create a new chat with users connected
    const chat = await this.databaseService.chat.create({
      data: {
        ...chatData,
        isGroup: isGroup || false,
        users: {
          connect: users.map((userId) => ({ id: userId })), // Connect users to the chat
        },
      },
      include: {
        users: true, // Include the users in the result
      },
    })

    return chat; // Return the newly created chat with users
  }

 async findAll(searchData :{searchData : string}) {
    if(searchData){
      return await this.databaseService.user.findMany({
        where : {
          email : {
            contains : searchData.searchData
          }
        }
      })
    }
    else {
      return this.databaseService.user.findMany()
    }
  }

  async findOne(id: string) {
    const chats = await this.databaseService.chat.findMany({
      where : {
        users : {
          some : {
            id
          }
        }
      },
      include : {
        users : {
          where : {
            id :{
              not : id
            }
          }
        } ,
        messages : true,
        lastMessage : true,

      }
    })
    return chats
  }

  update(id: number, updateChatDto: Prisma.ChatUpdateInput) {
    return `This action updates a #${id} chat`;
  }

 async remove(id: string) {
    const deleteChat = await this.databaseService.chat.delete({
      where : {
        id
      }
    })
    return deleteChat
  }
}
