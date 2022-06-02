import { Router } from 'express';
import {userController} from '../../controllers/user';
import {checkJWT} from '../../middlewares/auth/checkJWT';
import {checkRole} from '../../middlewares/auth/checkRole';
import {routerFollowArtist} from './follow/artist/index';
import {routerFollowEvent} from './follow/event/index';

const routerUsers = Router();

//followers for a user
routerUsers.use('/follow-artist', routerFollowArtist);
routerUsers.use('/follow-event', routerFollowEvent);

routerUsers.get('/', [checkJWT, checkRole(['ADMIN'])],userController.getUsersIncluding);
routerUsers.get('/:id', [checkJWT, checkRole(['ADMIN', 'BASIC'])], userController.getUserIncluding);

routerUsers.put('/:id',  [checkJWT, checkRole(['ADMIN', 'BASIC'])], userController.updateUser);
routerUsers.delete('/:id', [checkJWT, checkRole(['ADMIN', 'BASIC'])], userController.deleteUser);

export { routerUsers }

