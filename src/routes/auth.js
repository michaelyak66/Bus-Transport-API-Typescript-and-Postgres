import express from 'express';
import Auth from '../controllers/Auth';
import ValidateInput from '../helpers/validateInput';

const { create } = Auth;
const { validateSignup } = ValidateInput;

const router = express.Router();

router.post('/signup', validateSignup, create);

export default router;
