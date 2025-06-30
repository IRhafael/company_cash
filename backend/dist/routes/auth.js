"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, companyName, cnpj, businessType } = req.body;
        if (!name || !email || !password) {
            throw (0, errorHandler_1.createError)('Nome, email e senha são obrigatórios', 400);
        }
        if (password.length < 6) {
            throw (0, errorHandler_1.createError)('Senha deve ter pelo menos 6 caracteres', 400);
        }
        const existingUser = await req.db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            throw (0, errorHandler_1.createError)('Email já cadastrado', 400);
        }
        const saltRounds = 10;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        const userId = (0, uuid_1.v4)();
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        await req.db.run(`INSERT INTO users (id, name, email, password_hash, company_name, cnpj, business_type, avatar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [userId, name, email, passwordHash, companyName, cnpj, businessType, avatar]);
        const token = jsonwebtoken_1.default.sign({ userId, email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
        const user = {
            id: userId,
            name,
            email,
            companyName,
            cnpj,
            businessType,
            avatar,
            createdAt: new Date().toISOString()
        };
        res.status(201).json({
            success: true,
            user,
            token
        });
    }
    catch (error) {
        throw error;
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw (0, errorHandler_1.createError)('Email e senha são obrigatórios', 400);
        }
        const user = await req.db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            throw (0, errorHandler_1.createError)('Credenciais inválidas', 401);
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw (0, errorHandler_1.createError)('Credenciais inválidas', 401);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            companyName: user.company_name,
            cnpj: user.cnpj,
            businessType: user.business_type,
            avatar: user.avatar,
            createdAt: user.created_at
        };
        res.json({
            success: true,
            user: userData,
            token
        });
    }
    catch (error) {
        throw error;
    }
});
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await req.db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            throw (0, errorHandler_1.createError)('Usuário não encontrado', 404);
        }
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            companyName: user.company_name,
            cnpj: user.cnpj,
            businessType: user.business_type,
            avatar: user.avatar,
            createdAt: user.created_at
        };
        res.json({
            success: true,
            user: userData
        });
    }
    catch (error) {
        throw error;
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map