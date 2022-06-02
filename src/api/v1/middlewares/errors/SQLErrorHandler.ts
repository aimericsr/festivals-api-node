
import { NextFunction } from 'express';
import { CustomError } from '../../types/errors/customError';

export const SQLErrorHandler = (next: NextFunction, msg: string) => {
    return next(new CustomError(400, 'General', msg));
}
  
export function instanceOfpgError(data: any): data is pgError {
    return data;
}

export interface pgError {
    length: number | undefined,
    severity: string | undefined,
    code: string | undefined,
    detail: string | undefined,
    hint: string | undefined,
    position: string | undefined,
    internalPosition: string | undefined,
    internalQuery: string | undefined,
    where: string | undefined,
    schema: string | undefined,
    table: string | undefined,
    column: undefined,
    dataType: undefined,
    constraint: string | undefined,
    file: string | undefined,
    line: string | undefined,
    routine: string | undefined
}