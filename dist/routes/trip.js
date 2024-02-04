"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Trip_1 = __importDefault(require("../controllers/Trip"));
const validateInput_1 = __importDefault(require("../helpers/validateInput"));
const utils_1 = require("../helpers/utils");
const { create, getTrips, getOneTrip, cancelTrip } = Trip_1.default;
const { validateCreateTrip } = validateInput_1.default;
const router = express_1.default.Router();
router.post('/', utils_1.hasToken, utils_1.isAdmin, validateCreateTrip, create);
router.get('/', utils_1.hasToken, getTrips);
router.get('/:tripId', utils_1.hasToken, getOneTrip);
router.patch('/:tripId', utils_1.hasToken, utils_1.isAdmin, cancelTrip);
exports.default = router;
