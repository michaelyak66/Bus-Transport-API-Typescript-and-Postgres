"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.checkSeatNumber = exports.hasToken = exports.createToken = exports.isPassword = exports.hashPassword = exports.handleServerResponseError = exports.handleServerError = exports.handleServerResponse = exports.logger = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../controllers/db"));
dotenv_1.default.config();
const logger = () => {
    const log = bunyan_1.default.createLogger({ name: 'myapp' });
    return log;
};
exports.logger = logger;
/**
 * @param response response object from server
 * @param status error message
 * @param data meta-data
 * @returns error response
 */
const handleServerResponse = (res, status, data) => {
    return res.status(status).json({
        status: 'success',
        data
    });
};
exports.handleServerResponse = handleServerResponse;
/**
 * Handles server error.
 * @param res Response object
 * @param error Error object
 * @returns Response object
 */
const handleServerError = (res, error) => {
    (0, exports.logger)().error(error);
    return res.status(500).send({
        status: 'error',
        error: 'Internal Server Error'
    });
};
exports.handleServerError = handleServerError;
const handleServerResponseError = (res, status, message) => {
    (0, exports.logger)().error(message);
    return res.status(status).send({
        status: 'error',
        error: message
    });
};
exports.handleServerResponseError = handleServerResponseError;
/**
 * Hashes a password with bcrypt.
 * @param password Password to be hashed
 * @returns Password hash
 */
const hashPassword = async (password) => {
    const saltRounds = process.env.SALT;
    const hash = await bcrypt_1.default.hash(password, parseInt(saltRounds, 10));
    return hash;
};
exports.hashPassword = hashPassword;
/**
 * Checks if a password corresponds with saved hash in db.
 * @param password Plain password
 * @param hash Password hash
 * @returns True if correct or false if incorrect
 */
const isPassword = (password, hash) => bcrypt_1.default.compareSync(password, hash);
exports.isPassword = isPassword;
/**
 * Creates new JWT token for authentication.
 * @param id User id
 * @param isAdmin Whether user is an admin
 * @returns Newly created JWT
 */
const createToken = (id, isAdmin) => {
    const token = jsonwebtoken_1.default.sign({ id, isAdmin }, process.env.SECRET, { expiresIn: '7d' });
    return token;
};
exports.createToken = createToken;
/**
 * Checks if user has a valid token.
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns Response object
 */
const hasToken = async (req, res, next) => {
    const token = req.body.token || req.headers['x-access-token'] || req.headers.Authorization || req.body.Authorization;
    try {
        if (token) {
            const noBearer = token.replace(/Bearer\s/gi, '');
            const decoded = jsonwebtoken_1.default.verify(noBearer, process.env.SECRET);
            const text = 'SELECT * FROM Users WHERE id = $1';
            const { rows } = await db_1.default.query(text, [decoded.id]);
            if (!rows[0]) {
                return (0, exports.handleServerResponseError)(res, 403, 'Token you provided is invalid');
            }
            req.decoded = decoded;
            return next();
        }
        return (0, exports.handleServerResponseError)(res, 403, 'You have to be logged in');
    }
    catch (error) {
        return (0, exports.handleServerResponseError)(res, 403, error);
    }
};
exports.hasToken = hasToken;
/**
 * Checks if seat number is valid.
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns Response object
 */
const checkSeatNumber = async (req, res, next) => {
    const { trip_id, seat_number } = req.body;
    const tripQuery = `SELECT id, seats [${seat_number}]
  FROM Trips
  WHERE id = $1`;
    const value = [trip_id];
    try {
        if (seat_number) {
            const { rows } = await db_1.default.query(tripQuery, value);
            console.log(rows[0]);
            if (rows[0].seats.is_open === false) {
                return (0, exports.handleServerResponseError)(res, 409, `seat_number ${seat_number} already taken, please select another`);
            }
            return next();
        }
        return next();
    }
    catch (error) {
        return (0, exports.handleServerError)(res, error);
    }
};
exports.checkSeatNumber = checkSeatNumber;
/**
 * Checks if user is an admin.
 * @param req Request object
 * @param res Response object
 * @param next Next function
 * @returns Response object
 */
const isAdmin = async (req, res, next) => {
    const token = req.body.token || req.headers['x-access-token'] || req.headers.Authorization;
    try {
        const noBearer = token.replace(/Bearer\s/gi, '');
        const decoded = await jsonwebtoken_1.default.verify(noBearer, process.env.SECRET);
        if (!decoded) {
            return (0, exports.handleServerResponseError)(res, 403, 'You are not authorized to access this endpoint');
        }
        if (req.body.is_admin) {
            return next();
        }
        if (!decoded.isAdmin) {
            return (0, exports.handleServerResponseError)(res, 403, 'You are not authorized to access this endpoint');
        }
        return next();
    }
    catch (error) {
        return (0, exports.handleServerResponseError)(res, 403, error);
    }
};
exports.isAdmin = isAdmin;
