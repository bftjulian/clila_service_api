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

  async canActivate(context: ExecutionContext) {
    const webSocketClient = context.switchToWs().getClient();

    const token = webSocketClient.handshake.headers.authorization.split(' ')[1];

    if (!token) return false;

    const user = await this.usersRepository.findByApiToken(token);

    if (!user) return false;

    webSocketClient.handshake.auth.user = {
      id: user._id,
      email: user.email,
    };

    return true;
  }
}
