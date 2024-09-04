import { Router } from 'express';
import base from './base.router';
import auth from './auth.router';
import users from './user.router';

const router: Router = Router();

export default (): Router => {
  base(router);
  auth(router);
  users(router);

  return router;
};
