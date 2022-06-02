import { Router } from 'express';

const routerRoot = Router();

routerRoot.get('/', (req, res) => {
  res.status(200).header('Content-Type', 'text/html').send(`<h4> RESTful API festivals</h4>`);
});

export {routerRoot};
