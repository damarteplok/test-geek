import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  @SubscribeMessage('notificationToServer')
  handleMessage(client: any, payload: any): void {
    this.server.emit('notification', payload);
  }

  sendNotification(message: string) {
    this.server.emit('notification', message);
  }
}
