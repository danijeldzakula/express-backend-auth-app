import { Router } from 'express';
import {
  login,
  logout,
  refreshToken,
  register,
} from '@controllers/auth.controller';

export default (router: Router) => {
  router.route('/auth/login').post(login);
  router.route('/auth/register').post(register);
  router.route('/auth/token').post(refreshToken);
  router.route('/auth/logout').post(logout);
};
