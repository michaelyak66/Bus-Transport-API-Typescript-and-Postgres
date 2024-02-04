"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("./utils");
/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description validates signup input
 * @returns {Response | NextFunction} error or next function
 */
const signupInput = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const schema = joi_1.default.object().keys({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        email: joi_1.default.string().trim().email().required(),
        password: joi_1.default.string().min(8).required()
    });
    const validationObject = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    };
    const result = schema.validate(validationObject);
    if (result.error) {
        return (0, utils_1.handleServerResponseError)(res, 401, result.error.details[0].message);
    }
    next();
};
/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description validates signin input
 * @returns {Response | NextFunction} error or next function
 */
const signinInput = (req, res, next) => {
    const { email, password } = req.body;
    const schema = joi_1.default.object().keys({
        email: joi_1.default.string().trim().email().required(),
        password: joi_1.default.string().min(8).required()
    });
    const validationObject = {
        email: req.body.email,
        password: req.body.password
    };
    const result = schema.validate(validationObject);
    if (result.error) {
        return (0, utils_1.handleServerResponseError)(res, 401, result.error.details[0].message);
    }
    next();
};
/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description validates create bus input
 * @returns {Response | NextFunction} error or next function
 */
const createBusInput = (req, res, next) => {
    const { model, manufacturer, year, numberPlate, capacity } = req.body;
    const schema = joi_1.default.object().keys({
        model: joi_1.default.string().required(),
        manufacturer: joi_1.default.string().required(),
        year: joi_1.default.string().trim().required(),
        numberPlate: joi_1.default.string().required(),
        capacity: joi_1.default.number().required()
    });
    const validationObject = {
        model: req.body.model,
        manufacturer: req.body.manufacturer,
        year: req.body.year,
        numberPlate: req.body.numberPlate,
        capacity: req.body.capacity
    };
    const result = schema.validate(validationObject);
    if (result.error) {
        return (0, utils_1.handleServerResponseError)(res, 401, result.error.details[0].message);
    }
    next();
};
/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description validates create trip input
 * @returns {Response | NextFunction} error or next function
 */
const createTripInput = (req, res, next) => {
    const { bus_id, origin, destination, trip_date, fare } = req.body;
    const schema = joi_1.default.object().keys({
        bus_id: joi_1.default.number().required(),
        origin: joi_1.default.string().required(),
        destination: joi_1.default.string().trim().required(),
        trip_date: joi_1.default.string().required(),
        fare: joi_1.default.number().required()
    });
    const validationObject = {
        bus_id: req.body.bus_id,
        origin: req.body.origin,
        destination: req.body.destination,
        trip_date: req.body.trip_date,
        fare: req.body.fare
    };
    const result = schema.validate(validationObject);
    if (result.error) {
        return (0, utils_1.handleServerResponseError)(res, 401, result.error.details[0].message);
    }
    next();
};
/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description validates create booking input
 * @returns {Response | NextFunction} error or next function
 */
const createBookingInput = (req, res, next) => {
    const { trip_id } = req.body;
    const schema = joi_1.default.object().keys({
        trip_id: joi_1.default.number().required(),
    });
    const result = schema.validate({ trip_id: req.body.trip_id });
    if (result.error) {
        return (0, utils_1.handleServerResponseError)(res, 401, result.error.details[0].message);
    }
    next();
};
exports.default = {
    validateSignup: signupInput,
    validateSignin: signinInput,
    validateCreateBus: createBusInput,
    validateCreateTrip: createTripInput,
    validateCreateBooking: createBookingInput
};
