import {Request, Response, NextFunction} from "express"
import {followArtistService} from '../services/follow-artist';
import { CustomError } from '../types/errors/customError';

const dotenv = require('dotenv');
dotenv.config();

class FollowArtistController {
    async addFollowArtist(req: Request, res: Response, next: NextFunction) {
        try {
            const {user_id, artist_id} = req.body;
            const pool = req.pool;
            const rowCreated = await followArtistService.addFollowArtist(user_id, artist_id, pool, next);

            if (typeof rowCreated === 'undefined'){
                return;
            }else {
                res.location('https://' + process.env.PGHOST + ':' + process.env.SERVERPORT + req.originalUrl + '/' + rowCreated.rows[0].id);
                res.status(201).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async delFollowArtist(req: Request, res: Response, next: NextFunction) {
        try {
            const {user_id, artist_id} = req.body;
            const pool = req.pool;
            const rowDeleted = await followArtistService.delFollowArtist(user_id, artist_id, pool, next);
            if(typeof rowDeleted === 'undefined'){
                return;
            }else if (rowDeleted.rowCount === 0) {
                return next(new CustomError(404, 'General', 'no follow find with these ids, can\'t delete it'));
            } else{
                res.status(204).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }
}

export const followArtistController = new FollowArtistController();