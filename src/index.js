import express from 'express';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from './helpers/utils';
import auth from './routes/auth';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 1337;
// Log requests to the console.
app.use(morgan('dev'));

app.use(helmet())
  .disable('x-powered-by')
  .use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/api/v1', (req, res) => res.status(200).send({
  status: 'success',
  message: 'Welcome Save A Seat API'
}));

app.use('/api/v1/auth', auth);

app.listen(port);
logger().info(`app running on port ${port}`);

export default app;