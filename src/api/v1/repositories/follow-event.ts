import { NextFunction } from 'express';
import { Pool } from 'pg';
import { instanceOfpgError, SQLErrorHandler } from '../middlewares/errors/SQLErrorHandler';
import { CustomError } from '../types/errors/customError';

class FollowEventRepository {
    async addFollowEvent(user_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'INSERT INTO mobile_app.follow_event(user_id, event_id) VALUES ($1, $2) returning user_id;';
            const values = [user_id, event_id];
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

    async delFollowEvent(user_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'DELETE FROM mobile_app.follow_event WHERE user_id=$1 AND event_id=$2;';
            const values = [user_id, event_id];
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

export const followEventRepository = new FollowEventRepository();
