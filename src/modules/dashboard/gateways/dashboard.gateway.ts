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
import { AuthenticateService } from '../services/authenticate/authenticate.service';
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

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authenticated: AuthenticateService,
  ) {}

  public async afterInit(server: Server) {
    console.log('afterInit');
  }

  public async handleConnection(client: Socket) {
    console.log('handleConnection', client.handshake.headers.authorization);
    const token = client.handshake.headers.authorization.split(' ')[1];

    const user = await this.authenticated.authenticateConnection(token);

    if (!user) {
      client.disconnect(true);
      return;
    }

    await this.dashboardService.handleConnection(user);
  }

  public async handleDisconnect(client) {
    console.log('handleDisconnect');
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('dashboard_all_data')
  public async dashboardChannel(@ConnectedSocket() socket: Socket) {
    const user: IUserTokenDto = socket.handshake.auth.user;

    const dashboardData = await this.dashboardService.readAllDataFromCache(
      user,
    );

    return this.server.sockets.emit('dashboard_data', dashboardData);
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('dashboard_data_per_periods')
  public async readAllDataFromCache(
    @ConnectedSocket() socket: Socket,
    @MessageBody() period: any,
  ) {
    const user: IUserTokenDto = socket.handshake.auth.user;

    console.log(user, period);
  }
}
