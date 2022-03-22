import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { isAfter } from 'date-fns';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { IUserTokenDto } from './dtos/user-token.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true,
        secretOrKey: jwtConstants.secret,
      },
      (payload: any, done: VerifiedCallback) => {
        const expiresAt = new Date(payload.exp * 1000);
        if (isAfter(Date.now(), expiresAt)) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'token.expired',
          });
        }

        return done(null, payload);
      },
    );
  }

  async validate(payload: any): Promise<IUserTokenDto> {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
