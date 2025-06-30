"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
async function createDefaultSourcesAndCategories(userId) {
    const db = global.db;
    if (!db)
        throw new Error('Database not available');
    try {
        const defaultSources = await db.all('SELECT name, type, color, account_code FROM income_sources WHERE user_id = "default"');
        for (const source of defaultSources) {
            await db.run('INSERT INTO income_sources (id, user_id, name, type, color, account_code) VALUES (?, ?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), userId, source.name, source.type, source.color, source.account_code]);
        }
        const defaultCategories = await db.all('SELECT name, color, account_code FROM expense_categories WHERE user_id = "default"');
        for (const category of defaultCategories) {
            await db.run('INSERT INTO expense_categories (id, user_id, name, color, account_code) VALUES (?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), userId, category.name, category.color, category.account_code]);
        }
    }
    catch (error) {
        console.error('Erro ao criar dados padrão:', error);
        throw error;
    }
}
router.post('/register', async (req, res) => {
    try {
        const db = global.db;
        if (!db) {
            res.status(500).json({ error: 'Database not available' });
            return;
        }
        const { name, email, password, companyName, cnpj, businessType } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
            return;
        }
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            res.status(409).json({ error: 'Usuário já existe com este email' });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const userId = (0, uuid_1.v4)();
        await db.run('INSERT INTO users (id, name, email, password_hash, company_name, cnpj, business_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [userId, name, email, hashedPassword, companyName, cnpj, businessType, new Date().toISOString()]);
        await createDefaultSourcesAndCategories(userId);
        const token = jsonwebtoken_1.default.sign({ userId, email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        const user = await db.get('SELECT id, name, email, company_name as companyName, cnpj, business_type as businessType FROM users WHERE id = ?', [userId]);
        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user,
            token
        });
    }
    catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const db = global.db;
        if (!db) {
            res.status(500).json({ error: 'Database not available' });
            return;
        }
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            companyName: user.company_name,
            cnpj: user.cnpj,
            businessType: user.business_type
        };
        res.json({
            message: 'Login realizado com sucesso',
            user: userResponse,
            token
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const db = global.db;
        if (!db) {
            res.status(500).json({ error: 'Database not available' });
            return;
        }
        const user = await db.get('SELECT id, name, email, company_name as companyName, cnpj, business_type as businessType FROM users WHERE id = ?', [req.userId]);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map