import { Pool, PoolClient } from 'pg';
import { logger } from '../helpers/utils';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  logger().info('connected to the db');
});

/**
 * Create Tables
 * @returns {Promise<void>} void
 */
export const createBusTable = async (): Promise<void> => {
  const client: PoolClient = await pool.connect();
  const queryText: string = `
    CREATE TABLE IF NOT EXISTS
      Buses(
        id SERIAL PRIMARY KEY,
        number_plate VARCHAR(128) UNIQUE NOT NULL,
        manufacturer VARCHAR NOT NULL,
        model VARCHAR NOT NULL,
        year VARCHAR(128) NOT NULL,
        capacity INTEGER,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;
  try {
    logger().info('Creating Buses table');
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
 * @returns {Promise<void>} void
 */
export const dropBusTable = async (): Promise<void> => {
  logger().info('Dropping Buses table');
  const client: PoolClient = await pool.connect();
  const queryText: string = 'DROP TABLE IF EXISTS Buses';
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
