"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("../helpers/utils");
/**
 * @function getBus
 * @param {number} id id of bus
 * @returns {Promise<object>} object containing bus details
 */
const getBus = async (id) => {
    const busQuery = 'SELECT * FROM Buses WHERE id = $1';
    try {
        const { rows } = await db_1.default.query(busQuery, [id]);
        return rows[0];
    }
    catch (error) {
        return error;
    }
};
/**
 * @function createSeats
 * @param {number} busCapacity capacity of bus
 * @returns {Array<object>} array of objects containing seat number and seat status
 */
const createSeats = (busCapacity) => {
    const seats = new Array(busCapacity).fill(0).map((seat, index) => ({
        is_open: true,
        seat_number: index + 1
    }));
    return seats;
};
const Trip = {
    /**
     * @method create
     * @param {object} req request object
     * @param {object} res response object
     * @returns {Promise<object>} response object
     */
    async create(req, res) {
        const { bus_id, origin, destination, trip_date, fare } = req.body;
        try {
            const createQuery = `INSERT INTO
      Trips(bus_id, origin, destination, trip_date, fare, seats, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`;
            const bus = await getBus(bus_id);
            const values = [
                bus_id, origin.trim().toLowerCase(),
                destination.trim().toLowerCase(), (0, moment_1.default)(trip_date),
                fare, createSeats(bus ? bus.capacity : 7),
                (0, moment_1.default)(new Date()), (0, moment_1.default)(new Date())
            ];
            const { rows } = await db_1.default.query(createQuery, values);
            return (0, utils_1.handleServerResponse)(res, 201, rows[0]);
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * @method getTrips
     * @param {object} req request object
     * @param {object} res response object
     * @returns {Promise<object>} response object
     */
    async getTrips(req, res) {
        try {
            const findAllQuery = 'SELECT * FROM Trips';
            const { rows } = await db_1.default.query(findAllQuery);
            return (0, utils_1.handleServerResponse)(res, 200, rows);
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * @method getTrips
     * @param {object} req request object
     * @param {object} res response object
     * @returns {Promise<object>} response object
     */
    async getOneTrip(req, res) {
        console.log(req.params);
        try {
            const { tripId } = req.params;
            const findAllQuery = 'SELECT * FROM trips WHERE id = $1';
            const { rows } = await db_1.default.query(findAllQuery, [tripId]);
            return (0, utils_1.handleServerResponse)(res, 200, rows[0]);
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * @method cancelTrip
     * @param {object} req request object
     * @param {object} res response object
     * @returns {Promise<object>} response object
     */
    async cancelTrip(req, res) {
        try {
            const { tripId } = req.params;
            const findAllQuery = 'UPDATE Trips SET status = $2 WHERE id = $1 returning *';
            await db_1.default.query(findAllQuery, [tripId, 'cancelled']);
            return (0, utils_1.handleServerResponse)(res, 200, { message: 'Trip cancelled successfully' });
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    }
};
exports.default = Trip;
