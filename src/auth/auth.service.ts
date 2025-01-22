import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return { message: 'Login' };
  }

  signup() {
    return { message: 'Signup' };
  }
}
