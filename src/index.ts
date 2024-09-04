import { json, urlencoded } from 'body-parser';
import { connectToDatabase } from 'db';
import 'dotenv/config';
import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';

import router from './routes';
import { corsOptions } from 'config';

const app: Application = express();
const port = process.env.PORT || 3333;

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

const server = http.createServer(app);

connectToDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });

app.use('/api/v1', router());

export default app;
