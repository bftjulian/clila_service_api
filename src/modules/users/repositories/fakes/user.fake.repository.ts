import { CreateTokenRecoverPasswordDto } from '../../dtos/create-token-recover-password.dto';
import { RefreshToken } from '../../models/refresh-tokens';
import { User } from '../../models/users.model';
import { IUserRepository } from '../user-repository.interface';

export class FakeUserRepository implements IUserRepository {
  private users: User[] = [];
  private tokens: RefreshToken[] = [];

  public async create(userData: User): Promise<User> {
    const dataUser = {
      ...userData,
    };
    this.users.push(dataUser);
    return dataUser;
  }
  public async createRefreshTokens(data: RefreshToken): Promise<RefreshToken> {
    const dataToken = {
      ...data,
    } as RefreshToken;
    this.tokens.push(dataToken);
    return dataToken;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user._id === id);
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findRefreshTokenByUser(
    user: User,
  ): Promise<RefreshToken[] | undefined> {
    return this.tokens.filter((token) => token.user === user);
  }

  public async setRefreshToken(
    id: string,
    refresh_token: string,
    updated_at: Date,
  ): Promise<void> {
    const dataRefToken = this.tokens.find((token) => token._id === id);
    dataRefToken.refresh_token = refresh_token;
    dataRefToken.updated_at = updated_at;
  }

  public async setApiToken(id: string, api_token: string): Promise<void> {
    const dataApiToken = this.users.find((user) => user._id === id);
    dataApiToken.api_token = api_token;
  }

  public async setRecoverPasswordToken(
    id: string,
    data: CreateTokenRecoverPasswordDto,
  ): Promise<void> {
    const user = this.users.find((u) => u._id === id);
    user.recover_password_token = data.recover_password_token;
    user.date_generate_recover_password_token =
      data.date_generate_recover_password_token;
  }

  public async setPassword(id: string, password: string): Promise<void> {
    const user = this.users.find((u) => u._id === id);
    user.password = password;
    user.recover_password_token = null;
    user.date_generate_recover_password_token = null;
  }

  public async setCodeActivationEmail(id: string): Promise<void> {
    const user = this.users.find((u) => u._id === id);
    user.code_validation_email = 'A';
  }

  public async findByRefreshToken(
    refresh_token: string,
  ): Promise<RefreshToken | undefined> {
    const refToken = this.tokens.find(
      (token) => token.refresh_token === refresh_token,
    );
    return refToken;
  }

  public async findByApiToken(api_token: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.api_token === api_token);
    return user;
  }

  public async findByApiTokenPanel(
    api_token: string,
  ): Promise<User | undefined> {
    const user = this.users.find((u) => u.api_token === api_token);
    return user;
  }

  public async findByRecoverPasswordToken(
    recover_password_token: string,
  ): Promise<User | undefined> {
    const user = this.users.find(
      (u) => u.recover_password_token === recover_password_token,
    );
    return user;
  }

  public async deleteRefreshTokenById(id: string): Promise<void> {
    const findIndex = this.tokens.findIndex((token) => token._id === id);
    if (findIndex >= 0) {
      this.tokens.splice(findIndex, 1);
    }
    return;
  }

  public async setEmail(id: string, email: string): Promise<void> {
    const user = this.users.find((u) => u._id === id);
    user.email = email;
  }
}
