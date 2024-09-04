import { Router } from 'express';
import { getHelloWorld } from '@controllers/base.controller';

export default (router: Router) => {
  router.route('/').get(getHelloWorld);
};
