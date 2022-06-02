import { followEventController } from './../../../../controllers/follow-event';
import {Router} from 'express';
import {checkJWT} from '../../../../middlewares/auth/checkJWT';
import {checkRole} from '../../../../middlewares/auth/checkRole';

const routerFollowEvent = Router();

routerFollowEvent.post('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])], followEventController.addFollowEvent);
routerFollowEvent.delete('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])] , followEventController.delFollowEvent);

export { routerFollowEvent }