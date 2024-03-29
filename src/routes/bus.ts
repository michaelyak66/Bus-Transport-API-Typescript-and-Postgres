import express, { Router } from 'express';
import Bus from '../controllers/Bus';
import ValidateInput from '../helpers/validateInput';
import { isAdmin, hasToken } from '../helpers/utils';

const { create } = Bus;
const { validateCreateBus } = ValidateInput;

const router: Router = express.Router();

router.post('/', hasToken, isAdmin, validateCreateBus, create);

export default router;
