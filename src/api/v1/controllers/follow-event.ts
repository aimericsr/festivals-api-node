import {Request, Response, NextFunction} from "express"
import {followEventService} from '../services/follow-event';
import { CustomError } from '../types/errors/customError';
import 'dotenv/config';

export class FollowEventController {
    async addFollowEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {user_id, event_id} = req.body;
            const pool = req.pool;
            const rowCreated = await followEventService.addFollowEvent(user_id, event_id, pool, next);

            if (typeof rowCreated === 'undefined'){
                return;
            }else {
                res.location('http://' + process.env.PGHOST + ':' + process.env.SERVERPORT + req.originalUrl + '/' + rowCreated.rows[0].id);
            res.status(201).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async delFollowEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {user_id, event_id} = req.body;
            const pool = req.pool;
            const rowDeleted = await followEventService.delFollowEvent(user_id, event_id, pool, next);
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
 
export const followEventController = new FollowEventController();