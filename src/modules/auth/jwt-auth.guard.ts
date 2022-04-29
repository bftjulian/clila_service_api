import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isJWT } from 'class-validator';
import { Observable } from 'rxjs';
import { UserRepository } from '../users/repositories/implementation/user.repository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly usersRepository: UserRepository) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];
    if (token && isJWT(token)) return super.canActivate(context);

    return this.usersRepository
      .findByApiToken(token)
      .then((user) => !!user)
      .catch(() => false);
  }
}
