import { type CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ORIGIN_PROD_URI
      : process.env.ORIGIN_DEV_URI,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization,x-access-token,x-refresh-token',
  exposedHeaders: 'x-access-token,x-refresh-token',
  optionsSuccessStatus: 200,
  credentials: true,
};
