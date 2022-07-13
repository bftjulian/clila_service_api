import { Observable } from 'rxjs';
import { isJWT } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/implementation/user.repository';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from '../constants';
import { IUserTokenDto } from '../dtos/user-token.dto';
@Injectable()
export class JwtAuthWebsocketGuard extends AuthGuard('jwt') {
  constructor(private readonly usersRepository: UserRepository) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const websocketClient = context.switchToWs().getClient();

    const token = websocketClient.handshake.headers.authorization.split(' ')[1];

    console.log('TOKEN', token);

    if (!token) return false;

    if (token && isJWT(token)) {
      try {
        const decoded = verify(token, jwtConstants.secret) as IUserTokenDto;

        const user: IUserTokenDto = {
          id: decoded.id,
          email: decoded.email,
        };

        console.log('USER', user);

        websocketClient.handshake.auth.user = user;

        return true;
      } catch (err) {
        return false;
      }
    }

    return this.usersRepository
      .findByApiToken(token)
      .then((user) => {
        websocketClient.handshake.auth.user = user;

        return !!user;
      })
      .catch(() => false);
  }
}
