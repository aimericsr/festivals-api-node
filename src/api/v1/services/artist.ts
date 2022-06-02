import { NextFunction } from 'express';
import { Pool } from 'pg';
import {artistRepository} from '../repositories/artist';
import { CustomError } from '../types/errors/customError';

class ArtistService {
    async getArtist(id: number, pool: Pool, next: NextFunction) {
        try {
            return artistRepository.getArtist(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async getArtists(pool: Pool, next: NextFunction) {
        try {
            return artistRepository.getArtists(pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async createArtist(name: string, nationality: string, music_styles: string, pool: Pool, next: NextFunction) {
        try {
            return artistRepository.createArtist(name, nationality, music_styles, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async updateArtist(id: number, name: string, nationality: string, music_styles: string, pool: Pool, next: NextFunction) {
        try {
            return artistRepository.updateArtist(id, name, nationality, music_styles, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async deleteArtist(id: number, pool: Pool, next: NextFunction) {
        try {
            return artistRepository.deleteArtist(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }
}

export const artistService = new ArtistService();
