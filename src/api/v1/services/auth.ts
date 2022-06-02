import { NextFunction } from 'express';
import { Pool } from 'pg';
import {authRepository} from '../repositories/auth';
import { CustomError } from '../types/errors/customError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

class AuthService {
    async login(username: string, password: string, pool: Pool, next: NextFunction) {
        try {
            const user: any = await authRepository.getUserByUsername(username, pool, next);
            if (user.rowCount === 0) {
                return next(new CustomError(404, 'General', 'no user found with this username'));
            } else {
                if (await bcrypt.compare(password, user.rows[0].password)) {
                    const userToken = {id: user.rows[0].id, role: user.rows[0].name};
                    const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
                    const refreshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION});

                    await authRepository.createToken(refreshToken, pool, next);
                    return {accessToken: accessToken, refreshToken: refreshToken};
                } else {
                    return next(new CustomError(400, 'General', 'wrong password'));
                }
            }
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async getAccessToken(refreshToken: string, pool: Pool, next: NextFunction) {
        try {
            const resAccessToken: any = await authRepository.searchRefreshToken(refreshToken, pool, next);
            let currentAccessToken=null;
            if (resAccessToken.rowCount === 0) {
                return next(new CustomError(404, 'General', 'bad refresh token provided'));
            } else {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
                    if (err) {
                        console.log(err);
                    }
                    currentAccessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
                })
                return {accessToken: currentAccessToken};
            }
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async logout(refreshToken: string, pool: Pool, next: NextFunction) {
        try {
            return authRepository.deleteRefreshToken(refreshToken, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }
}

export const authService = new AuthService();


