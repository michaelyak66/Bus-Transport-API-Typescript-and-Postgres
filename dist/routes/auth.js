"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("../controllers/Auth"));
const validateInput_1 = __importDefault(require("../helpers/validateInput"));
const { create, login } = Auth_1.default;
const { validateSignup, validateSignin } = validateInput_1.default;
const router = express_1.default.Router();
router.post('/signup', validateSignup, async (req, res, next) => {
    try {
        await create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/signin', validateSignin, async (req, res, next) => {
    try {
        await login(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
