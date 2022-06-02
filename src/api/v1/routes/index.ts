import {Router} from 'express';
import { routerUsers } from './users/index';
import {routerEvents} from './events/index';
import {routerArtist} from './artists/index';
import {routerAuth} from './auths/index';
import {router404} from './pages/404';
import {routerRoot} from './pages/root';

const routerV1 = Router();

routerV1.use('/users', routerUsers);
routerV1.use('/events', routerEvents);
routerV1.use('/artists', routerArtist);
routerV1.use('/auth', routerAuth);

routerV1.use('/',routerRoot);
routerV1.use(router404);

export { routerV1 }