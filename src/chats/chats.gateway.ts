import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    transports: ['websocket'],
  },
})
// @Injectable()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private onlineUsers: Set<string> = new Set();

  constructor(
    private readonly messageService: MessageService,
    private readonly chatsService: ChatsService,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.add(userId);
      this.server.emit('onlineUsers', Array.from(this.onlineUsers));
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('onlineUsers', Array.from(this.onlineUsers));
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { senderId: string; chatId: string; content: string },
  ) {
    const message = await this.messageService.sendMessage(
      data.senderId,
      data.chatId,
      data.content,
    );
    this.server.to(data.chatId).emit('newMessage', message); // Emit to room
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ) {
    client.join(chatId); // Join specific chat room
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ) {
    client.leave(chatId);
  }
}
