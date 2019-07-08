import { dropUserTable } from './user';
import { dropBusTable } from './bus';
import { dropTripTable } from './trip';
import { dropBookingTable } from './booking';

const dropTables = async () => {
  await dropUserTable();
  await dropBusTable();
  await dropTripTable();
  await dropBookingTable();
};

export default dropTables;
