import bunyan from 'bunyan';

export const logger = () => {
  const log = bunyan.createLogger({ name: 'myapp' });
  return log;
};

export const handleServerError = (res, error) => {
  logger().error(error);
  return res.status(500).send({
    status: 'error',
    error: 'Internal Server Error'
  });
};
