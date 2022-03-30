import { CreateTokenRecoverPasswordDto } from '../dtos/create-token-recover-password.dto';
import { RefreshToken } from '../models/refresh-tokens';
import { User } from '../models/users.model';

export interface IUserRepository {
  create(data: User): Promise<User>;
  createRefreshTokens(data: RefreshToken): Promise<RefreshToken>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByApiToken(api_token: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  setRefreshToken(
    id: string,
    refresh_token: string,
    updated_at: Date,
  ): Promise<void>;
  setApiToken(id: string, api_token: string): Promise<void>;
  setPassword(id: string, password: string): Promise<void>;
  setRecoverPasswordToken(
    id: string,
    data: CreateTokenRecoverPasswordDto,
  ): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<RefreshToken | undefined>;
  findByRecoverPasswordToken(
    recover_password_token: string,
  ): Promise<User | undefined>;
  findByApiTokenPanel(api_token: string): Promise<User | undefined>;
  findRefreshTokenByUser(user: User): Promise<RefreshToken[] | undefined>;
  setCodeActivationEmail(id: string): Promise<void>;
  deleteRefreshTokenById(id: string): Promise<void>;
  setEmail(id: string, email: string): Promise<void>;
}
