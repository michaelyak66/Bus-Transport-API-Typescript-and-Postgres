import express from 'express';
import Auth from '../../controllers/Auth';
import ValidateInput from '../../helpers/validateInput';

const { create, login } = Auth;
const { validateSignup, validateSignin } = ValidateInput;

const router = express.Router();

router.post('/signup', validateSignup, create);
router.post('/signin', validateSignin, login);

export default router;
