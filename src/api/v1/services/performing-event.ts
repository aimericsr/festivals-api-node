import { NextFunction } from 'express';
import { Pool } from 'pg';
import {performingEventRepository} from '../repositories/performing-event';
import { CustomError } from '../types/errors/customError';

class PerformingEventService {
    async addPerformingEvent(artist_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            return performingEventRepository.addPerformingEvent(artist_id, event_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async delPerformingEvent(artist_id: number, event_id: number, pool: Pool, next: NextFunction) {
        try {
            return performingEventRepository.delPerformingEvent(artist_id, event_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }
}

export const performingEventService = new PerformingEventService();
