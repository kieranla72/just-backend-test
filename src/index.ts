import express, { Express } from 'express';
import { tripsRouter } from './controllers';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();

app.use(express.json());

app.use(tripsRouter);

app.listen(5001, () => {
  console.log('app is listening============');
  console.log('Server listening on port 5000');
});
