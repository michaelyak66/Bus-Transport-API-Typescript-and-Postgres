"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Bus_1 = __importDefault(require("../controllers/Bus"));
const validateInput_1 = __importDefault(require("../helpers/validateInput"));
const utils_1 = require("../helpers/utils");
const { create } = Bus_1.default;
const { validateCreateBus } = validateInput_1.default;
const router = express_1.default.Router();
router.post('/', utils_1.hasToken, utils_1.isAdmin, validateCreateBus, create);
exports.default = router;
