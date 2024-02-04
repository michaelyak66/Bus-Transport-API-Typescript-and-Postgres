import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Access DATABASE_URL after loading environment variables
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// interface QueryParams {
//   text: string;
//   params: any[];
// }

export default {
  /**
   * DB Query
   * @param {string} text
   * @param {Array} params
   * @returns {Promise<QueryResult<any>>} object
   */
  query(text: string, params?: any[]): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res: QueryResult<any>) => {
          resolve(res);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
};
