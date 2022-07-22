import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmitService {
  public async emitEvent(userSocketInfo, data) {
    const websocketServer = new Server();

    console.log('EVENT_EMIT_TO_WEBSOCKET', data);

    return websocketServer
      .to(userSocketInfo.socketId)
      .emit(userSocketInfo.userChannel, data);
  }
}
