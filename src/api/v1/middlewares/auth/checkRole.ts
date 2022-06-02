import { Request, Response, NextFunction } from 'express';
import { Role } from '../../types/auth/JWTPayload';
import { CustomError } from '../../types/errors/customError';
import { DBConnectionHandler } from '../../../../DBConnection/FestivalsDatabase/DBConnectionHandler';

export const checkRole = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    var role: Role;
    if (req.jwtPayload){
      role = req.jwtPayload.role;
    }else {
      role = 'NOAUTH'
    }
    
    if (roles.indexOf(role) === -1) {
      const customError = new CustomError(
        401, 
        'Unauthorized', 
        `Current role: ${role}. Required role: ${roles.toString()}Unauthorized - Insufficient user rights`);
      return next(customError);
    }

    switch(role) {
      case 'ADMIN':
        req.pool =  DBConnectionHandler.getInstance().getAdminPoolConnection;
      case 'BASIC':
        req.pool =  DBConnectionHandler.getInstance().getBasicPoolConnection;
      case 'NOAUTH':
        req.pool = DBConnectionHandler.getInstance().getNoAuthPoolConnection;
    }
    return next();
  };
};
