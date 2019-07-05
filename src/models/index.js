import { createUserTable, dropUserTable } from './user';
import { createBusTable, dropBusTable } from './bus';
import { createTripTable, dropTripTable } from './trip';

module.exports = {
  createUserTable,
  dropUserTable,
  createBusTable,
  dropBusTable,
  createTripTable,
  dropTripTable
};

require('make-runnable');
