import { dropUserTable } from './user';
import { dropBusTable } from './bus';
import { dropTripTable } from './trip';
import { dropBookingTable } from './booking';

const dropTables = async (): Promise<void> => {
  try {
    await dropBookingTable();
    await dropTripTable();
    await dropBusTable();
    await dropUserTable();
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
};

export default dropTables;
