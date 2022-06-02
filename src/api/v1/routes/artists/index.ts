import {Router} from 'express';
import {artistController} from '../../controllers/artist';
import {routerArtistPerform} from './perform/index';
import {checkJWT} from '../../middlewares/auth/checkJWT';
import {checkRole} from '../../middlewares/auth/checkRole';

const routerArtist = Router();

routerArtist.use('/perform-event', routerArtistPerform);

routerArtist.get('/:id', [checkJWT, checkRole(['ADMIN', 'BASIC'])], artistController.getArtistIncluding);
routerArtist.get('/' , [checkJWT, checkRole(['ADMIN', 'BASIC'])], artistController.getArtistsIncluding);

routerArtist.post('/', [checkJWT, checkRole(['ADMIN'])], artistController.createArtist);
routerArtist.put('/:id', [checkJWT, checkRole(['ADMIN'])], artistController.updateArtist);
routerArtist.delete('/:id', [checkJWT, checkRole(['ADMIN'])], artistController.deleteArtist);

export {routerArtist}