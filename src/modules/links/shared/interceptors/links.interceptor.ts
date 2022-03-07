import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRepository } from 'src/modules/users/repositories/implementation/user.repository';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';

@Injectable()
export class LinksInterceptor implements NestInterceptor {
  constructor(
    @Inject(UserRepository)
    private readonly usersRepository: IUserRepository,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const {
        headers: { authorization },
      } = context.switchToHttp().getRequest();
      const apiToken = authorization.split(' ')[1];
      const user = await this.usersRepository.findByApiTokenPanel(apiToken);
      if (user) {
        return next.handle();
      } else {
        throw '';
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
