"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireAdmin = requireAdmin;
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "No token provided" });
    const token = header.split(" ")[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { id: payload.userId, role: payload.role };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin only" });
    }
    next();
}
