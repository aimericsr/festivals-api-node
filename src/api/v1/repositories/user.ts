import { NextFunction } from "express";
import { Pool } from "pg";
import { SQLErrorHandler, instanceOfpgError } from "../middlewares/errors/SQLErrorHandler";
import { CustomError } from "../types/errors/customError";

class UserRepository {
  async getUserIncluding(id: number, pool: Pool, next: NextFunction) {
    try {
      const text = `
            select row_to_json(u)
            from (select id,password,email,
                (select array_to_json(array_agg(row_to_json(e)))
                from (select id, name, location, started_date, finish_date
                    from follow_event
                    inner join events
                    on follow_event.event_id = events.id
                    where user_id = users.id
                ) e
                ) as events,
                (select array_to_json(array_agg(row_to_json(a)))
                 from (select id, name, nationality, music_styles
                    from follow_artist
                    inner join artists
                    on follow_artist.artist_id = artists.id
                    where user_id = users.id
                ) a
                ) as artists
            from users
            where id = $1
            ) u;`;
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

  async getUsersIncluding(pool: Pool, next: NextFunction) {
    try {
      const text = `
            select array_to_json(array_agg(row_to_json(u)))
            from (select id, password, email,
                 (select array_to_json(array_agg(row_to_json(e)))
                    from (select id, name, location, started_date, finish_date
                        from follow_event
                        inner join events
                        on follow_event.event_id = events.id
                        where user_id = users.id
                     ) e
                ) as events,
                (select array_to_json(array_agg(row_to_json(a)))
                    from (select id, name, nationality, music_styles
                        from follow_artist
                        inner join artists
                        on follow_artist.artist_id = artists.id
                        where user_id = users.id
                    ) a
                ) as artists
            from users
        ) u;`;
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

  async createUser(username: string, password: string, email: string, pool: Pool, next: NextFunction) {
    try {
      const text =
        "INSERT INTO mobile_app.users(username, password, email, role) VALUES ($1, $2, $3, $4) returning id;";
      const values = [username,password,email,"388e710f-5256-46e3-ab94-f6b0bfa2d87e"];
      return await pool.query(text, values);
    } catch (err) {
      if (instanceOfpgError(err)) {
        switch (err.code) {
          case "23505":
            return SQLErrorHandler(next, "username or email already exists");
          default:
            return SQLErrorHandler(next, "unknown error");
        }
      } else {
        return next(new CustomError(500, "General", "internal server error from the PostgreSQL Server"));
      }
    }
  }

  async updateUser(id: number, username: string, password: string, email: string, pool: Pool, next: NextFunction) {
    try {
      const text =
        "UPDATE mobile_app.users set username=$1, password=$2, email=$3 WHERE id=$4;";
      const values = [username, password, email, id];
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

  async deleteUser(id: number, pool: Pool, next: NextFunction) {
    try {
      const text = "DELETE FROM mobile_app.users WHERE id=$1;";
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

export const userRepository = new UserRepository();