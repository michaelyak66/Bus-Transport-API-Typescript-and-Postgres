import { createUserTable } from './user';
import { createBusTable } from './bus';
import { createTripTable } from './trip';

const createTables = async () => {
  await createUserTable();
  await createBusTable();
  await createTripTable();
  await createBusTable();
};

export default createTables;
