import Joi from 'joi';
import { handleServerResponseError } from '../utils';

console.log("e reach here")


/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates signup input
 * @returns {Response | RequestHandler} error or request handler
 */
const signupInput = (req, res, next) => {
  // logger().info(req);
  console.log(req.body)

  const {
    // eslint-disable-next-line camelcase
    first_name, last_name, email, password
  } = req.body;
  const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
  });

  const validationObject = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
  
  const result = schema.validate(validationObject);
  

  // const result = Joi.validate({
  //   first_name, last_name, email, password
  // }, schema);


  if (result.error) {
    console.log("2", result.error);
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates signin input
 * @returns {Response | RequestHandler} error or request handler
 */
const signinInput = (req, res, next) => {
  const {
    email, password
  } = req.body;
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
  });

  const validationObject = {
    email: req.body.email,
    password: req.body.password
  };
  
  const result = schema.validate(validationObject);

  // const result = Joi.validate({
  //   email, password
  // }, schema);

  if (result.error) {
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates create bus input
 * @returns {Response | RequestHandler} error or request handler
 */
const createBusInput = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    model, manufacturer, year, numberPlate, capacity
  } = req.body;
  const schema = Joi.object().keys({
    model: Joi.string().required(),
    manufacturer: Joi.string().required(),
    year: Joi.string().trim().required(),
    numberPlate: Joi.string().required(),
    capacity: Joi.number().required()
  });

  const validationObject = {
    model: req.body.model,
    manufacturer: req.body.manufacturer,
    year: req.body.year,
    numberPlate: req.body.numberPlate,
    capacity: req.body.capacity

  };
  
  const result = schema.validate(validationObject);

  // const result = Joi.validate({
  //   model, manufacturer, year, numberPlate, capacity
  // }, schema);

  if (result.error) {
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates create trip input
 * @returns {Response | RequestHandler} error or request handler
 */
const createTripInput = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    bus_id, origin, destination, trip_date, fare
  } = req.body;
  const schema = Joi.object().keys({
    bus_id: Joi.number().required(),
    origin: Joi.string().required(),
    destination: Joi.string().trim().required(),
    trip_date: Joi.string().required(),
    fare: Joi.number().required()
  });

  const validationObject = {
    bus_id: req.body.bus_id,
    origin: req.body.origin,
    destination: req.body.destination,
    trip_date: req.body.trip_date,
    fare: req.body.fare

  };
  
  const result = schema.validate(validationObject);

  // const result = Joi.validate({
  //   bus_id, origin, destination, trip_date, fare
  // }, schema);

  if (result.error) {
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates create booking input
 * @returns {Response | RequestHandler} error or request handler
 */
const createBookingInput = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    trip_id
  } = req.body;
  const schema = Joi.object().keys({
    trip_id: Joi.number().required(),
  });

  // const result = Joi.validate({
  //   trip_id
  // }, schema);

  const result = schema.validate({trip_id: req.body.trip_id});

  if (result.error) {
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

export default {
  validateSignup: signupInput,
  validateSignin: signinInput,
  validateCreateBus: createBusInput,
  validateCreateTrip: createTripInput,
  validateCreateBooking: createBookingInput
};
