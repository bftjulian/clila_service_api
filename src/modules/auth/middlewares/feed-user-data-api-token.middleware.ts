import { Injectable, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';

@Injectable()
export class FeedUserDataApiTokenMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UserRepository) {}
  public async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization.split(' ')[1];
    if (token && !isJWT(token)) {
      const user = await this.usersRepository.findByApiToken(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
