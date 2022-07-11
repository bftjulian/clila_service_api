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
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { DashboardService } from '../services/dashboard/dashboard.service';

@WebSocketGateway(3002, {
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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('get_all_data')
  public async dashboardChannel(@ConnectedSocket() socket: Socket) {
    const handshake = socket.handshake;

    console.log('handshake', handshake);

    // let user: IUserTokenDto;

    // const dashboardData = await this.dashboardService.readAllDataFromCache(
    //   user,
    // );

    // this.server.sockets.emit('dashboard_data', dashboardData);
  }

  @SubscribeMessage('get_data_in_periods')
  public async readAllDataFromCache(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data,
  ) {
    console.log(data);
  }
}
