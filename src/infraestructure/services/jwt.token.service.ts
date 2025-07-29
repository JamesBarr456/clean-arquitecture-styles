// infrastructure/services/jwt-token.service.ts
import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/services/token.service';

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {}

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
