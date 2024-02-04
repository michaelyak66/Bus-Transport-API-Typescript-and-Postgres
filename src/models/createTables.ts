import { createUserTable } from './user';
import { createBusTable } from './bus';
import { createTripTable } from './trip';
import { createBookingTable } from './booking';

const createTables = async (): Promise<void> => {
  try {
    await createUserTable();
    await createBusTable();
    await createTripTable();
    await createBookingTable();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export default createTables;
