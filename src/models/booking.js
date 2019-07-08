
import { Pool } from 'pg';
import { logger } from '../helpers/utils';

const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE
});

pool.on('connect', () => {
  logger().info('connected to the db');
});

/**
 * Create Tables
 * @returns {*} void
 */
export const createBookingTable = async () => {
  const client = await pool.connect();
  const queryText = `
    CREATE TABLE IF NOT EXISTS
      Bookings(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        trip_id INTEGER NOT NULL,
        created_on TIMESTAMP,
        modified_date TIMESTAMP
        FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
        FOREIGN KEY (trip_id) REFERENCES Trip (id) ON DELETE CASCADE
      )`;
  try {
    const response = await client.query(queryText);
    logger().info(response);
  } catch (error) {
    logger().error(error);
  } finally {
    client.release();
  }
};

/**
 * Drop Tables
 * @returns {*} void
 */
export const dropBookingTable = async () => {
  const client = await pool.connect();
  const queryText = 'DROP TABLE IF EXISTS Bookings';
  try {
    const response = await client.query(queryText);
    logger().info(response);
  } catch (error) {
    logger().error(error);
  } finally {
    client.release();
  }
};

pool.on('remove', () => {
  logger().info('client removed');
  process.exit(0);
});
