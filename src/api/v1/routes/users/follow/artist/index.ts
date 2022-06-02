import {Router} from 'express';
import {followArtistController} from '../../../../controllers/follow-artist';
import {checkJWT} from '../../../../middlewares/auth/checkJWT';
import {checkRole} from '../../../../middlewares/auth/checkRole';

const routerFollowArtist = Router();

routerFollowArtist.post('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])], followArtistController.addFollowArtist);
routerFollowArtist.delete('/', [checkJWT, checkRole(['ADMIN', 'BASIC'])], followArtistController.delFollowArtist);

export { routerFollowArtist }
