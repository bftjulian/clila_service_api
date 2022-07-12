import {
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { IUserTokenDto } from '../../auth/dtos/user-token.dto';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { JwtAuthWebsocketGuard } from '../../auth/guards/jwt-auth-websocket.guard';
import { WebsocketFeedUserDataApiTokenMiddleware } from '../../auth/middlewares/websocket-feed-data-api-token.middleware';

@WebSocketGateway(3002, {
  middlewares: [WebsocketFeedUserDataApiTokenMiddleware],
  cors: {
    origin: '*',
  },
})
export class DashboardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly dashboardService: DashboardService) {}

  public async afterInit(server: Server) {
    console.log('afterInit');
  }

  public async handleConnection(client) {
    console.log('handleConnection');
  }

  public async handleDisconnect(client) {
    console.log('handleDisconnect');
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('dashboard_all_data')
  public async dashboardChannel(@ConnectedSocket() socket: Socket) {
    const user: IUserTokenDto = socket.handshake.auth.user;

    const dashboardData = await this.dashboardService.handleConnection(user);

    return this.server.sockets.emit('dashboard_data', dashboardData);
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('get_data_in_periods')
  public async readAllDataFromCache(
    @ConnectedSocket() socket: Socket,
    @MessageBody() period: any,
  ) {
    console.log(period);
  }
}
