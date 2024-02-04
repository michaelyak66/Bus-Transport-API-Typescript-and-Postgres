"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const utils_1 = require("./helpers/utils");
const auth_1 = __importDefault(require("./routes/auth"));
const bus_1 = __importDefault(require("./routes/bus"));
const trip_1 = __importDefault(require("./routes/trip"));
const booking_1 = __importDefault(require("./routes/booking"));
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '1337', 10); // Define the port for the server
// Log requests to the console.
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)())
    .disable('x-powered-by')
    .use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.get('/api/v1', (req, res) => res.status(200).send({
    status: 'success',
    message: 'Welcome Save A Seat API'
}));
// Routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/buses', bus_1.default);
app.use('/api/v1/trips', trip_1.default);
app.use('/api/v1/bookings', booking_1.default);
// Swagger Documentation
app.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Start the server
app.listen(port, () => {
    (0, utils_1.logger)().info(`App running on port ${port}`);
});
exports.default = app;
