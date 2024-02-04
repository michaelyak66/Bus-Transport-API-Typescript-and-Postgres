"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("../helpers/utils");
const Bus = {
    async create(req, res) {
        const { model, numberPlate, manufacturer, year, capacity } = req.body;
        try {
            const createQuery = `INSERT INTO
      Buses(model, number_plate, manufacturer, year, capacity, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
            const values = [
                model.trim().toLowerCase(), numberPlate.trim().toLowerCase(),
                manufacturer.trim().toLowerCase(), year,
                capacity, (0, moment_1.default)(new Date()), (0, moment_1.default)(new Date())
            ];
            const { rows } = await db_1.default.query(createQuery, values);
            return (0, utils_1.handleServerResponse)(res, 201, { bus: rows[0] });
        }
        catch (error) {
            if (error.routine === '_bt_check_unique') {
                return (0, utils_1.handleServerResponseError)(res, 409, `Bus with number plate:- ${numberPlate.trim().toLowerCase()} already exists`);
            }
            (0, utils_1.handleServerError)(res, error);
        }
    },
};
exports.default = Bus;
