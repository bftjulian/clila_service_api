import { Observable } from 'rxjs';
import { isJWT } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/implementation/user.repository';

@Injectable()
export class JwtAuthWebsocketGuard extends AuthGuard('jwt') {
  constructor(private readonly usersRepository: UserRepository) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const webSocketClient = context.switchToWs().getClient();

    const token = webSocketClient.handshake.headers.authorization.split('')[1];

    if (token && isJWT(token)) return super.canActivate(context);

    return this.usersRepository
      .findByApiToken(token)
      .then((user) => !!user)
      .catch(() => false);
  }
}
