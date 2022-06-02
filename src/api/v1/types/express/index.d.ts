import { Pool } from 'pg';
import { Language } from 'typeorm/entities/users/types';
import { JwtPayload } from '../auth/JWTPayload';

declare global {
  namespace Express {
    interface Request {
      jwtPayload: JwtPayload;
      pool: Pool;
      language: Language;
    }
    interface Response {
      customSuccess(httpStatusCode: number, message: string, data?: any): Response;
    }
  }
}
