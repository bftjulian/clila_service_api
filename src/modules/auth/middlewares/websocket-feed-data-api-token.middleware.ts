import { Socket } from 'socket.io';
import { isJWT } from 'class-validator';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';

@Injectable()
export class WebsocketFeedUserDataApiTokenMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UserRepository) {}
  public async use(socket: Socket, res: any, next: () => void) {
    console.log('socket', socket);
    const authorization = socket.handshake.headers.authorization;

    console.log('AUTHORIZATION', authorization);

    if (!authorization) return next();
    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) return next();

    const token = bearer[1];

    if (token && !isJWT(token)) {
      const user = await this.usersRepository.findByApiToken(token);
      if (user) {
        socket.handshake.auth.user = user;
      }
    }
    return next();
  }
}
