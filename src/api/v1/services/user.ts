import { NextFunction } from 'express';
import { userRepository } from '../repositories/user';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { CustomError } from '../types/errors/customError';

class UserService {
    async getUserIncluding(id: number, pool: Pool, next: NextFunction) {
        try {
            return userRepository.getUserIncluding(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async getUsersIncluding(pool: Pool, next: NextFunction) {
        try {
            return userRepository.getUsersIncluding(pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async createUser(username: string, password: string, email: string, pool: Pool, next: NextFunction) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return userRepository.createUser(username, hashedPassword, email, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async updateUser(id: number, username: string, password: string, email: string, pool: Pool, next: NextFunction) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return userRepository.updateUser(id, username, hashedPassword, email, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }

    async deleteUser(id: number, pool: Pool, next: NextFunction) {
        try {
            return userRepository.deleteUser(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }
    }
}

export const userService = new UserService();
