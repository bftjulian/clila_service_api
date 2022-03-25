export class User {
  _id: string;
  email: string;
  password: string;
  api_token: string;
  __v: number;
  recover_password_token?: string;
  date_generate_recover_password_token?: Date;
  code_validation_email?: string;
}
