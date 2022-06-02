import {Router} from 'express';
import {performingEventController} from '../../../controllers/performing-event';
import {checkJWT} from '../../../middlewares/auth/checkJWT';
import {checkRole} from '../../../middlewares/auth/checkRole';

const routerArtistPerform = Router();

routerArtistPerform.post('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])], performingEventController.addPerformingEvent);
routerArtistPerform.delete('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])] , performingEventController.delPerformingEvent);

export {routerArtistPerform}