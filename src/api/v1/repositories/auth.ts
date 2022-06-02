import { NextFunction } from 'express';
import { Pool } from 'pg';
import { instanceOfpgError, SQLErrorHandler } from '../middlewares/errors/SQLErrorHandler';
import { CustomError } from '../types/errors/customError';

class AuthRepository {
    async getUserByUsername(username: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.users LEFT JOIN mobile_app.roles ON users.role=roles.id WHERE username=$1;';
            const values = [username];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
                console.log(err);
                
              switch (err.code) {
                case '42501':
                    return SQLErrorHandler(next, "insufficient right");
                default:
                    return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }

    async getUuidRole(roleName: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT id FROM mobile_app.roles WHERE name=$1;';
            const values = [roleName];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
              switch (err.code) {
                default:
                  return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }

    async createToken(refreshToken: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'INSERT INTO mobile_app.refresh_token(token_value) VALUES ($1);';
            const values = [refreshToken];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
              switch (err.code) {
                default:
                  return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }

    async searchRefreshToken(refreshToken: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.refresh_token WHERE token_value=$1;';
            const values = [refreshToken];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
              switch (err.code) {
                default:
                  return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }

    async deleteRefreshToken(refreshTokenDel: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'DELETE FROM mobile_app.refresh_token WHERE token_value=$1 returning id;';
            const values = [refreshTokenDel];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
              switch (err.code) {
                default:
                  return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }
}

export const authRepository = new AuthRepository();