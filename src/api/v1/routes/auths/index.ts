import {Router} from 'express';
import {userController} from '../../controllers/user';
import {authController} from '../../controllers/auth';
import {checkRole} from '../../middlewares/auth/checkRole';

const routerAuth = Router();

routerAuth.post('/register', [checkRole(['NOAUTH'])] ,userController.createUser);
routerAuth.post('/login', [checkRole(['NOAUTH'])] ,authController.login);
routerAuth.post('/token', [checkRole(['NOAUTH'])] ,authController.getToken);
routerAuth.post('/logout', [checkRole(['NOAUTH'])] ,authController.logout);

export {routerAuth}
