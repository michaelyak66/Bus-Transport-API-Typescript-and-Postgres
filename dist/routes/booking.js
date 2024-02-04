"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../controllers/Booking"));
const validateInput_1 = __importDefault(require("../helpers/validateInput"));
const utils_1 = require("../helpers/utils");
const { create, getBookings, getOneBooking, deleteBooking } = Booking_1.default;
const { validateCreateBooking } = validateInput_1.default;
const router = express_1.default.Router();
router.post('/', utils_1.hasToken, validateCreateBooking, utils_1.checkSeatNumber, create);
router.get('/', utils_1.hasToken, getBookings);
router.get('/:bookingId', utils_1.hasToken, getOneBooking);
router.delete('/:bookingId', utils_1.hasToken, deleteBooking);
exports.default = router;
