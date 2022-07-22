import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { VerifyService } from '../../dashboard/services/verify/verify.service';
@Injectable()
export class JwtAuthWebsocketGuard extends AuthGuard('jwt') {
  constructor(private readonly verifyService: VerifyService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const websocketClient = context.switchToWs().getClient();

    const handshake = websocketClient.handshake;

    const userOrUndefined = await this.verifyService.authenticateConnection(
      handshake,
    );

    if (userOrUndefined === undefined) return false;

    handshake.auth.user = userOrUndefined;

    return true;
  }
}
