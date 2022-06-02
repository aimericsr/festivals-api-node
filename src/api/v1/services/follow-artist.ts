import { NextFunction } from 'express';
import { Pool } from 'pg';
import {followArtistRepository} from '../repositories/follow-artist';
import { CustomError } from '../types/errors/customError';

class FollowArtistService {
    async addFollowArtist(user_id: number, artist_id: number, pool: Pool, next: NextFunction) {
        try {
            return followArtistRepository.addFollowArtist(user_id, artist_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async delFollowArtist(user_id: number, artist_id: number, pool: Pool, next: NextFunction) {
        try {
            return followArtistRepository.delFollowArtist(user_id, artist_id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }
}

export const followArtistService = new FollowArtistService();
