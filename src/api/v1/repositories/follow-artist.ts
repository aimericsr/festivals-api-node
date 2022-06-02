import { NextFunction } from 'express';
import { Pool } from 'pg';
import { instanceOfpgError, SQLErrorHandler } from '../middlewares/errors/SQLErrorHandler';
import { CustomError } from '../types/errors/customError';

class FollowArtistRepository {
    async addFollowArtist(user_id: number, artist_id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'INSERT INTO mobile_app.follow_artist(user_id, artist_id) VALUES ($1, $2) returning user_id;';
            const values = [user_id, artist_id];
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

    async delFollowArtist(user_id: number, artist_id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'DELETE FROM mobile_app.follow_artist WHERE user_id=$1 AND artist_id=$2;';
            const values = [user_id, artist_id];
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

export const followArtistRepository = new FollowArtistRepository();
