import { NextFunction } from 'express';
import { Pool } from 'pg';
import {followEventRepository} from '../repositories/follow-event';
import { CustomError } from '../types/errors/customError';


class FollowEventService {
    async addFollowEvent(user_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            return followEventRepository.addFollowEvent(user_id, event_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async delFollowEvent(user_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            return followEventRepository.delFollowEvent(user_id, event_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }
}

export const followEventService = new FollowEventService();
