import { NextFunction } from 'express';
import { Pool } from 'pg';
import { instanceOfpgError, SQLErrorHandler } from '../middlewares/errors/SQLErrorHandler';
import { CustomError } from '../types/errors/customError';

class ArtistRepository {
    async getArtist(id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.artists WHERE id=$1;';
            const values = [id];
            return await pool.query(text, values);
          } catch (err) {
            if (instanceOfpgError(err)) {
              switch (err.code) {
                case '22P02':
                    return SQLErrorHandler(next, "UUID not found");
                default:
                  return SQLErrorHandler(next, "unknown error");
              }
            } else {
              return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
            }
          }
    }

    async getArtists(pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.artists;';
            return await pool.query(text);
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

    async createArtist(name: string, nationality: string, music_styles: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'INSERT INTO mobile_app.artists(name, nationality, music_styles) VALUES ($1, $2, $3) returning id;';
            const values = [name, nationality, music_styles];
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

    async updateArtist(id: number, name: string, nationality: string, music_styles: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'UPDATE mobile_app.artists set name=$1, nationality=$2, music_styles=$3 WHERE id=$4;';
            const values = [name, nationality, music_styles, id];
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

    async deleteArtist(id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'DELETE FROM mobile_app.artists WHERE id=$1;';
            const values = [id];
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

export const artistRepository = new ArtistRepository();


