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
    console.log('afterInit'.toUpperCase());
  }

  public async handleConnection(client: Socket) {
    console.log('handleConnection'.toUpperCase());

    const handshake = client.handshake;

    const user = await this.verifyService.authenticateConnection(handshake);

    if (!user) {
      client.disconnect(true);
      return;
    }

    return this.verifyService.handleConnection(user);
  }

  public async handleDisconnect(client) {
    console.log('handleDisconnect'.toUpperCase());

    const handshake = client.handshake;

    const user = await this.verifyService.authenticateConnection(handshake);

    if (!user) return;

    await this.verifyService.handleDisconnect(user);
  }

  @UseGuards(JwtAuthWebsocketGuard)
  @SubscribeMessage('dashboard_data')
  public async dashboardChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userChannel: string,
  ) {
    const user: IUserTokenDto = socket.handshake.auth.user;

    await this.verifyService.userSocketInfo(user, socket.id, userChannel);

    const totalClicks = await this.readService.readTotalClicks(user);

    const totalLinks = await this.readService.readTotalLinks(user);

    const totalGroups = await this.readService.readTotalGroups(user);

    socket.emit(userChannel, {
      big_numbers: [totalClicks, totalLinks, totalGroups],
    });

    const clicksGrouped = await this.readService.readClicksGrouped(user);

    socket.emit(userChannel, clicksGrouped);

    const linksGrouped = await this.readService.readLinksGrouped(user);

    socket.emit(userChannel, linksGrouped);

    const groupsGrouped = await this.readService.readGroupsGrouped(user);

    socket.emit(userChannel, groupsGrouped);
  }
}
