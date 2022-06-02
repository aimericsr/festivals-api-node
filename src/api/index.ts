import express from 'express';
import { routerV1 } from './v1/routes/index';
import { errorHandler } from './v1/middlewares/errors/errorHandler';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/v1',routerV1);
app.use(errorHandler);

app.listen(port, () => console.log('Server running !!'));