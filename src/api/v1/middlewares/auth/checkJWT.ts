import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/auth/JWTPayload';
import { CustomError } from "../../types/errors/customError";
import 'dotenv/config';

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers['authorization'];
            if (!authHeader){
                return next(new CustomError(400, 'General', 'Authorization header not provided'));
            }
            const token = authHeader.split(' ')[1];
            if (!token){
                return next(new CustomError(400, 'General', 'JWT Token not provided'));
            }

            try {
              const jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
              req.jwtPayload = jwtPayload;
            } catch (err) {
              return next(new CustomError(401, 'Raw', 'JWT error'));
            }
        }