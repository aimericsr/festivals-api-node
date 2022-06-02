import {Request, Response, NextFunction} from "express"
import {authService} from "../services/auth";
import { CustomError } from '../types/errors/customError';


class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, password} = req.body;
            const pool = req.pool;
            const user: any = await authService.login(username, password, pool, next);

            if (typeof user === 'undefined') {
                return;
            }else {
                res.status(200).json({accessToken: user.accessToken, refreshToken: user.refreshToken});
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async getToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.body.refreshToken;
            const pool = req.pool;
            const accessToken = await authService.getAccessToken(refreshToken, pool, next);
            if (typeof accessToken === 'undefined') {
                return;
            } else {
                res.status(200).json({accessToken: accessToken.accessToken});
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.body.refreshToken;
            const pool = req.pool;
            const deletedToken: any = await authService.logout(refreshToken, pool, next);
            if (typeof deletedToken === 'undefined') {
                return;
            } else {
                res.status(204).json();
            }
        } catch (err) {
            return next(new CustomError(500, 'General', 'server error'));
        }
    }
}

export const authController = new AuthController();