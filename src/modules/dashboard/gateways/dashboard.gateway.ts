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
import { LoadService } from '../services/load/load.service';
import { ReadService } from '../services/read/read.service';
import { IUserTokenDto } from '../../auth/dtos/user-token.dto';
import { VerifyService } from '../services/verify/verify.service';
import { JwtAuthWebsocketGuard } from '../../auth/guards/jwt-auth-websocket.guard';

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

  constructor(
    private readonly readService: ReadService,
    private readonly loadService: LoadService,
    private readonly verifyService: VerifyService,
  ) {}

  public async afterInit(server: Server) {
    console.log('afterInit');
  }

  public async handleConnection(client: Socket) {
    const handshake = client.handshake;

    const user = await this.verifyService.authenticateConnection(handshake);

    if (!user) {
      client.disconnect(true);
      return;
    }

    await this.verifyService.handleConnection(user);
  }

  public async handleDisconnect(client) {
    console.log('handleDisconnect');
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('dashboard_all_data')
  public async dashboardChannel(@ConnectedSocket() socket: Socket) {
    const user: IUserTokenDto = socket.handshake.auth.user;

    const dataEntities = ['clicks', 'links', 'groups'];

    const func = async () => {
      await Promise.all(
        dataEntities.map(async (dataEntity) => {
          const readTotalData = await this.readService.readTotalData(
            user,
            dataEntity,
          );

          socket.emit('dashboard_data', readTotalData);
        }),
      );
    };

    await func();
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
