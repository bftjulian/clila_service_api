import { isAfter } from 'date-fns';
import { jwtConstants } from '../constants';
import { PassportStrategy } from '@nestjs/passport';
import { IUserTokenDto } from '../dtos/user-token.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class WebsocketJwtStrategy extends PassportStrategy(Strategy) {
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
