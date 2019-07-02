import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from './helpers/utils';

const app = express();
// Log requests to the console.
app.use(morgan('dev'));

app.use(helmet())
  .disable('x-powered-by')
  .use(cors());
app.use(express.json());

app.get('/api/v1', (req, res) => res.status(200).send({
  status: 'success',
  message: 'Welcome Save A Seat API'
}));

app.listen(1337);
logger().info('app running on port ', 1337);
