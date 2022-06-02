import {Request, Response, NextFunction} from "express"
import {artistService} from '../services/artist';
import { CustomError } from '../types/errors/customError';
import 'dotenv/config';

class ArtistController {
    async getArtistIncluding(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const pool = req.pool;
            const user = await artistService.getArtist(parseInt(id), pool, next);

            if (typeof user === 'undefined'){
                return;
            }
            else if(user.rowCount === 0){
                return next(new CustomError(404, 'General', 'No event found'));
            }
            else {
                res.status(200).json(user.rows[0]);
            }      
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async getArtistsIncluding(req: Request, res: Response, next: NextFunction) {
        try {
            const pool = req.pool;
            const artists: any = await artistService.getArtists(pool, next);

            if (typeof artists === 'undefined'){
                return;
            }
            else if(artists.rowCount === 0){
                return next(new CustomError(404, 'General', 'No artist found'));
            }
            else {
                res.status(200).json(artists.rows);
            }   
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async createArtist(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, nationality, music_styles} = req.body;
            const pool = req.pool;
            const rowCreated = await artistService.createArtist(name, nationality, music_styles, pool, next);
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

    async updateArtist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const {name, nationality, music_styles} = req.body;
            const pool = req.pool;
            const rowUpdated: any = await artistService.updateArtist(parseInt(id), name, nationality, music_styles, pool, next);
            if (typeof rowUpdated === 'undefined'){
                return;
            }else if(rowUpdated.rowCount === 0){
                return next(new CustomError(404, 'General', 'no artist found'));
            }else{
                res.status(200).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async deleteArtist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const pool = req.pool;
            const rowDeleted: any = await artistService.deleteArtist(parseInt(id), pool, next);
            if (typeof rowDeleted === 'undefined'){
                return;
            }else if(rowDeleted.rowCount === 0){
                return next(new CustomError(404, 'General', 'no artist found'));
            }else{
                res.status(204).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }
}

export const artistController = new ArtistController();