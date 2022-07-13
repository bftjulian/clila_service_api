import { verify } from 'jsonwebtoken';
import { isJWT } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { jwtConstants } from '../../../auth/constants';
import { IUserTokenDto } from 'src/modules/auth/dtos/user-token.dto';
import { IUserRepository } from 'src/modules/users/repositories/user-repository.interface';
import { UserRepository } from '../../../users/repositories/implementation/user.repository';

@Injectable()
export class AuthenticateService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async authenticateConnection(token: string) {
    if (!token) return undefined;

    if (token && isJWT(token)) {
      try {
        const decoded = verify(token, jwtConstants.secret) as IUserTokenDto;

        const user: IUserTokenDto = {
          id: decoded.id,
          email: decoded.email,
        };

        return user;
      } catch (err) {
        return undefined;
      }
    }

    const user = await this.userRepository.findByApiToken(token);

    if (!user) return undefined;

    return {
      id: user._id,
      email: user.email,
    };
  }
}
