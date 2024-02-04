"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Access DATABASE_URL after loading environment variables
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL
});
// interface QueryParams {
//   text: string;
//   params: any[];
// }
exports.default = {
    /**
     * DB Query
     * @param {string} text
     * @param {Array} params
     * @returns {Promise<QueryResult<any>>} object
     */
    query(text, params) {
        return new Promise((resolve, reject) => {
            pool.query(text, params)
                .then((res) => {
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
};
