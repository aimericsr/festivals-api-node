import { Router, Response, Request } from 'express';

const router404 = Router();

router404.get('*', (req: Request, res: Response) => {
  return res.status(404).json('Router API v1 Not Found, 404 Not Found');
});

export {router404};
