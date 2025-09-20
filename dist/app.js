"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const sweets_1 = __importDefault(require("./routes/sweets"));
const purchases_1 = __importDefault(require("./routes/purchases"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Public
app.use('/api/auth', auth_1.default);
// Protected inside sweets routes
app.use('/api/sweets', sweets_1.default);
app.use('/api/purchases', purchases_1.default);
exports.default = app;
