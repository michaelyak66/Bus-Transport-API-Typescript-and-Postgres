"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("../helpers/utils");
const Auth = {
    async create(req, res) {
        const { email, first_name, last_name, password, userType } = req.body;
        try {
            const hash = await (0, utils_1.hashPassword)(password);
            const createQuery = `INSERT INTO
      Users(email, first_name, last_name, password, is_admin, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
            const values = [
                email.trim().toLowerCase(), first_name.trim().toLowerCase(),
                last_name.trim().toLowerCase(), hash,
                userType === 'admin', (0, moment_1.default)(new Date()), (0, moment_1.default)(new Date())
            ];
            const { rows } = await db_1.default.query(createQuery, values);
            const token = (0, utils_1.createToken)(rows[0].id, rows[0].is_admin);
            return (0, utils_1.handleServerResponse)(res, 201, {
                user_id: rows[0].id,
                is_admin: rows[0].is_admin,
                token
            });
        }
        catch (error) {
            if (error.routine === '_bt_check_unique') {
                return (0, utils_1.handleServerResponseError)(res, 409, `User with Email:- ${email.trim().toLowerCase()} already exists`);
            }
            (0, utils_1.handleServerError)(res, error);
        }
    },
    async login(req, res) {
        const userQuery = 'SELECT * FROM Users WHERE email = $1';
        const { email, password } = req.body;
        try {
            const { rows } = await db_1.default.query(userQuery, [email.trim().toLowerCase()]);
            if (!rows[0]) {
                return (0, utils_1.handleServerResponseError)(res, 404, 'Account with Email not found');
            }
            if (!(0, utils_1.isPassword)(password, rows[0].password)) {
                return (0, utils_1.handleServerResponseError)(res, 403, 'Password incorrect');
            }
            const token = (0, utils_1.createToken)(rows[0].id, rows[0].is_admin);
            return (0, utils_1.handleServerResponse)(res, 200, {
                user_id: rows[0].id, is_admin: rows[0].is_admin, token
            });
        }
        catch (error) {
            return (0, utils_1.handleServerError)(res, error);
        }
    },
};
exports.default = Auth;
