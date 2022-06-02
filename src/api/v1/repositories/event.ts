import { NextFunction } from 'express';
import { Pool } from 'pg';
import { instanceOfpgError, SQLErrorHandler } from '../middlewares/errors/SQLErrorHandler';
import { CustomError } from '../types/errors/customError';

class EventRepository {
    async getEvent(id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.events WHERE id=$1;';
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

    async getEvents(pool: Pool, next: NextFunction) {
        try {
            const text = 'SELECT * FROM mobile_app.events;';
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

    async createEvent(name: string, location: string, started_date: string, finish_date: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'INSERT INTO mobile_app.events(name, location, started_date, finish_date) VALUES ($1, $2, $3, $4) returning id;';
            const values = [name, location, started_date, finish_date];
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

    async updateEvent(id: number, name: string, location: string, started_date: string, finish_date: string, pool: Pool, next: NextFunction) {
        try {
            const text = 'UPDATE mobile_app.events set name=$1, location=$2, started_date=$3, finish_date=$4 WHERE id=$5;';
            const values = [name, location, started_date, finish_date, id];
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

    async deleteEvent(id: number, pool: Pool, next: NextFunction) {
        try {
            const text = 'DELETE FROM mobile_app.events WHERE id=$1;';
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

export const eventRepository = new EventRepository();
