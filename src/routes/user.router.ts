import { Router } from 'express';
import { getAllUsers } from '@controllers/users.controller';

export default (router: Router) => {
  router.route('/users').get(getAllUsers);
};
