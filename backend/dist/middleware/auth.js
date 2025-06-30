"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw (0, errorHandler_1.createError)('Token de acesso requerido', 401);
        }
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                throw (0, errorHandler_1.createError)('Token inválido', 403);
            }
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next();
        }
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (!err && decoded) {
                req.userId = decoded.userId;
                req.userEmail = decoded.email;
            }
            next();
        });
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map