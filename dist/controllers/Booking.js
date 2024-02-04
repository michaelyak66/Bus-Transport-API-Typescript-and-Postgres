"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("../helpers/utils");
/**
 * @function reserveSeat
 * @param {number} tripId id of Trip
 * @param {number} seatNumber, seat number to update
 * @returns {object} object containing Trip details
 */
const reserveSeat = async (tripId, seatNumber) => {
    const tripQuery = `UPDATE Trips
  SET seats [$3] = $2 WHERE id = $1 returning *`;
    const value = [
        tripId, { is_open: false, seat_number: seatNumber }, seatNumber
    ];
    try {
        await db_1.default.query(tripQuery, value);
        return seatNumber;
    }
    catch (error) {
        return error;
    }
};
/**
 * @function checkSeatNumber
 * @param {number} tripId id of Trip
 * @param {number} seatNumber, seat number to update
 * @returns {object} object containing Trip details
 */
const checkSeatNumber = async (tripId, seatNumber) => {
    if (seatNumber) {
        const reservedSeatNumber = await reserveSeat(tripId, seatNumber);
        return reservedSeatNumber;
    }
    const getTrip = 'SELECT seats FROM Trips WHERE id = $1';
    const value = [
        tripId
    ];
    try {
        const { rows } = await db_1.default.query(getTrip, value);
        const selectedSeat = rows[0].seats.find((seat) => seat.is_open === true);
        const reservedSeatNumber = await reserveSeat(tripId, selectedSeat.seat_number);
        return reservedSeatNumber;
    }
    catch (error) {
        return error;
    }
};
const constructData = (trip) => ({
    id: trip.id,
    user_id: trip.user_id,
    trip_id: trip.trip_id,
    seat_number: trip.seat_number,
    created_date: trip.created_date,
    modified_date: trip.modified_date,
});
const Booking = {
    /**
     * @method create
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} response object
     */
    async create(req, res) {
        const { user_id, trip_id, seat_number } = req.body;
        try {
            const createQuery = `INSERT INTO
      Bookings(user_id, trip_id, seat_number, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
            const seat = await checkSeatNumber(trip_id, seat_number);
            const values = [
                user_id || req.decoded.id, trip_id, seat,
                (0, moment_1.default)(new Date()), (0, moment_1.default)(new Date())
            ];
            const { rows } = await db_1.default.query(createQuery, values);
            const bookingQuery = `SELECT user_id, trip_id, bus_id, seat_number, trip_date, first_name, last_name, email
      FROM Bookings booking, Users, Trips trip WHERE booking.id = $1 AND Users.id = booking.user_id AND trip.id = booking.trip_id`;
            const booking = await db_1.default.query(bookingQuery, [rows[0].id]);
            const result = booking.rows[0];
            result.id = rows[0].id;
            return (0, utils_1.handleServerResponse)(res, 201, result);
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * @method getBookings
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} response object
     */
    async getBookings(req, res) {
        try {
            const { is_admin, user_id } = req.body;
            const id = req.decoded.id || user_id;
            const isAdmin = req.decoded.is_admin || is_admin;
            const userQuery = 'SELECT * FROM Users WHERE id = $1';
            const findAllQuery = `SELECT user_id, trip_id, bus_id, seat_number, trip_date, first_name, last_name, email
      FROM Bookings booking, Users, Trips trip WHERE Users.id = booking.user_id AND trip.id = booking.trip_id`;
            const findUserQuery = `SELECT user_id, trip_id, bus_id, seat_number, trip_date, first_name, last_name, email
      FROM Bookings booking, Users, Trips trip WHERE booking.user_id = $1 AND Users.id = booking.user_id AND trip.id = booking.trip_id`;
            const user = await db_1.default.query(userQuery, [id]);
            if (user.rows[0].is_admin || isAdmin) {
                const { rows } = await db_1.default.query(findAllQuery);
                return (0, utils_1.handleServerResponse)(res, 200, rows);
            }
            const { rows } = await db_1.default.query(findUserQuery, [user.rows[0].id || id]);
            return (0, utils_1.handleServerResponse)(res, 200, rows);
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * @method getOneBooking
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} response object
     */
    async getOneBooking(req, res) {
        try {
            const { bookingId } = req.params;
            console.log(bookingId);
            const findAllQuery = 'SELECT * FROM Bookings WHERE id = $1';
            const { rows } = await db_1.default.query(findAllQuery, [bookingId]);
            console.log(rows);
            if (!rows[0]) {
                return (0, utils_1.handleServerResponse)(res, 200, []);
            }
            return (0, utils_1.handleServerResponse)(res, 200, constructData(rows[0]));
        }
        catch (error) {
            (0, utils_1.handleServerError)(res, error);
        }
    },
    /**
     * Delete A Booking
     * @param {object} req
     * @param {object} res
     * @returns {void} return statuc code 204
     */
    async deleteBooking(req, res) {
        const { bookingId } = req.params;
        const bookingQuery = 'SELECT * FROM Bookings WHERE id = $1';
        const { rows } = await db_1.default.query(bookingQuery, [bookingId]);
        if (!rows || rows.length < 1) {
            return (0, utils_1.handleServerResponseError)(res, 404, `Booking with id ${bookingQuery} does not exist`);
        }
        const deleteQuery = 'DELETE FROM Bookings WHERE id = $1';
        try {
            await db_1.default.query(deleteQuery, [bookingId]);
            return (0, utils_1.handleServerResponse)(res, 200, { message: 'Booking deleted successfully' });
        }
        catch (error) {
            return (0, utils_1.handleServerError)(res, error);
        }
    }
};
exports.default = Booking;
