import { CustomError } from './../types/errors/customError';
import {Request, Response, NextFunction} from "express"
import {userService} from '../services/user';
import 'dotenv/config';

class UserController {
    async getUserIncluding(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const pool = req.pool;
            const userRows = await userService.getUserIncluding(parseInt(id), pool, next);

            if (typeof userRows === 'undefined'){
                return;
            }
            else if(userRows.rowCount === 0){
                return next(new CustomError(404, 'General', 'No user found'));
            }
            else {
                res.status(200).json(userRows.rows);
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async getUsersIncluding(req: Request, res: Response, next: NextFunction) {
        try {
            const pool = req.pool;
            const users = await userService.getUsersIncluding(pool, next);

            if (typeof users === 'undefined'){
                return;
            }
            else if(users.rowCount === 0){
                return next(new CustomError(404, 'General', 'No users found'));
            }
            else {
                //res.status(200).json(users.rows[0].array_to_json);
                res.status(200).json(users.rows[0].array_to_json);
            }
        } catch (err: any) {
            return next(new CustomError(404, 'General', 'bad request'));
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, password, email} = req.body;
            const pool = req.pool;
            const userCreated = await userService.createUser(username, password, email, pool, next);
            //si erreur
            if (typeof userCreated === 'undefined'){
                return;
            }else {
                res.location('http://' + process.env.PGHOST + ':' + process.env.PORT + req.originalUrl + '/' + userCreated.rows[0].id);
                res.status(201).json();
            }
        } catch (err: any) {            
            return next(new CustomError(500, 'General', 'internal server error'));
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const {username, password, email} = req.body;
            const pool = req.pool;
            const rowUpdated = await userService.updateUser(parseInt(id), username, password, email, pool, next);
            if (typeof rowUpdated === 'undefined'){
                return;
            }else if(rowUpdated.rowCount === 0){
                return next(new CustomError(404, 'General', 'wrong uuid'));
            }else{
                res.status(200).json();
            }
        } catch (err: any) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const pool = req.pool;
            const rowDeleted = await userService.deleteUser(parseInt(id), pool, next);

            if (typeof rowDeleted === 'undefined'){
                return;
            }else if(rowDeleted.rowCount === 0){
                return next(new CustomError(404, 'General', 'bad request'));
            }else{
                res.status(204).json();
            }
        } catch (err: any) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }
}

export const userController = new UserController();