import {Request, Response, NextFunction} from "express"
import {eventService} from '../services/event';
import { CustomError } from '../types/errors/customError';
import 'dotenv/config';

class EventController {
    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const pool = req.pool;
            const user = await eventService.getEvent(parseInt(id), pool, next);

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

    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const pool = req.pool;
            const users: any = await eventService.getEvents(pool, next);

            if (typeof users === 'undefined'){
                return;
            }
            else if(users.rowCount === 0){
                return next(new CustomError(404, 'General', 'No event found'));
            }
            else {
                res.status(200).json(users.rows);
            }   
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, location, started_date, finish_date} = req.body;
            const pool = req.pool;
            const rowCreated = await eventService.createEvent(name, location, started_date, finish_date, pool, next);
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

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const {name, location, started_date, finish_date} = req.body;
            const pool = req.pool;
            const rowUpdated: any = await eventService.updateEvent(parseInt(id), name, location, started_date, finish_date, pool, next);

            if (typeof rowUpdated === 'undefined'){
                return;
            }else if(rowUpdated.rowCount === 0){
                return next(new CustomError(404, 'General', 'wrong uuid'));
            }else{
                res.status(200).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const pool = req.pool;
            const rowDeleted: any = await eventService.deleteEvent(parseInt(id), pool, next);

            if (typeof rowDeleted === 'undefined'){
                return;
            }else if(rowDeleted.rowCount === 0){
                return next(new CustomError(404, 'General', 'wrong uuid'));
            }else{
                res.status(204).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }
}

export const eventController = new EventController();