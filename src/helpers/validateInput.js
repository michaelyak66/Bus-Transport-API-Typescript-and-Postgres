import Joi from '@hapi/joi';
import { handleServerResponseError } from './utils';

/**
 * @function
  * @param {*} req
  * @param {*} res
  * @param {*} next
 * @description validates signup input
 * @returns {Response | RequestHandler} error or request handler
 */
const signupInput = (req, res, next) => {
  const {
    firstname, lastname, email, password
  } = req.body;
  const schema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
  });
  const result = Joi.validate({
    firstname, lastname, email, password
  }, schema);
  if (result.error) {
    return handleServerResponseError(res, 401, result.error.details[0].message);
  }
  return next();
};

export default {
  validateSignup: signupInput
};
