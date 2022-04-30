import { Injectable, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';

@Injectable()
export class FeedUserDataApiTokenMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UserRepository) {}
  public async use(req: any, res: any, next: () => void) {
    const { authorization } = req.headers;
    if (!authorization) return next();
    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) return next();

    const token = bearer[1];

    if (token && !isJWT(token)) {
      const user = await this.usersRepository.findByApiToken(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
