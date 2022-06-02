import { NextFunction } from 'express';
import { Pool } from 'pg';
import {eventRepository} from '../repositories/event';
import { CustomError } from '../types/errors/customError';

class EventService {
    async getEvent(id: number, pool: Pool, next: NextFunction) {
        try {
            return eventRepository.getEvent(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        }  
    }

    async getEvents(pool: Pool, next: NextFunction) {
        try {
            return eventRepository.getEvents(pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        } 
    }

    async createEvent(name: string, location: string, started_date: string, finish_date: string, pool: Pool, next: NextFunction) {
        try {
            return eventRepository.createEvent(name, location, started_date, finish_date, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        } 
    }

    async updateEvent(id: number, name: string, location: string, started_date: string, finish_date: string, pool: Pool, next: NextFunction) {
        try {
            return eventRepository.updateEvent(id, name, location, started_date, finish_date, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        } 
    }

    async deleteEvent(id: number, pool: Pool, next: NextFunction) {
        try {
            return eventRepository.deleteEvent(id, pool, next);
        }
        catch(err){
            return next(new CustomError(500, 'General', 'internal server error from the servie layout'));
        } 
    }
}

export const eventService = new EventService();
