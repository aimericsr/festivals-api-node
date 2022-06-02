import {Router} from 'express';
import {eventController} from '../../controllers/event';
import {checkJWT} from '../../middlewares/auth/checkJWT';
import {checkRole} from '../../middlewares/auth/checkRole';

const routerEvents = Router();

routerEvents.get('/:id', [checkJWT, checkRole(['ADMIN', 'BASIC'])], eventController.getEvent);
routerEvents.get('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])],eventController.getEvents);

routerEvents.post('/', [checkJWT, checkRole(['ADMIN'])], eventController.createEvent);
routerEvents.put('/:id', [checkJWT, checkRole(['ADMIN'])], eventController.updateEvent);
routerEvents.delete('/:id', [checkJWT, checkRole(['ADMIN'])], eventController.deleteEvent);

export {routerEvents}