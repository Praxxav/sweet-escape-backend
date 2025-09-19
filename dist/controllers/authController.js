"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
async function register(req, res) {
    const body = req.body;
    if (!body.email || !body.password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt_1.default.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: role || "USER" },
        });
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        return res.status(201).json({ token });
    }
    catch {
        return res.status(400).json({ error: "Email already exists" });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    return res.json({ token });
}
