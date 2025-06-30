"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }
        const user = await global.db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        if (!user.password) {
            logger_1.logger.error(`Usuário ${email} tem senha null/undefined no banco`);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            token,
            user: userWithoutPassword
        });
        logger_1.logger.info(`Login bem-sucedido para: ${email}`);
        return;
    }
    catch (error) {
        logger_1.logger.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
});
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, companyName, cnpj, businessType } = req.body;
        if (!name || !email || !password || !companyName) {
            res.status(400).json({
                error: 'Nome, email, senha e nome da empresa são obrigatórios'
            });
            return;
        }
        const existingUser = await global.db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            res.status(409).json({ error: 'Usuário já existe com este email' });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const userId = (0, uuid_1.v4)();
        await global.db.run(`
      INSERT INTO users (id, name, email, password, company_name, cnpj, business_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, name, email, hashedPassword, companyName, cnpj || null, businessType || null]);
        const defaultIncomeSources = [
            { name: 'Honorários Contábeis', description: 'Receitas de serviços contábeis regulares', color: '#3B82F6' },
            { name: 'Consultoria Tributária', description: 'Receitas de consultoria em tributos', color: '#10B981' },
            { name: 'Serviços Diversos', description: 'Outras receitas de serviços', color: '#F59E0B' }
        ];
        for (const source of defaultIncomeSources) {
            await global.db.run(`
        INSERT INTO income_sources (id, user_id, name, description, color, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [(0, uuid_1.v4)(), userId, source.name, source.description, source.color, 1]);
        }
        const defaultExpenseCategories = [
            { name: 'Aluguel', description: 'Aluguel do escritório', color: '#DC2626' },
            { name: 'Funcionários', description: 'Salários e encargos', color: '#7C3AED' },
            { name: 'Despesas Operacionais', description: 'Outras despesas operacionais', color: '#059669' }
        ];
        for (const category of defaultExpenseCategories) {
            await global.db.run(`
        INSERT INTO expense_categories (id, user_id, name, description, color, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [(0, uuid_1.v4)(), userId, category.name, category.description, category.color, 1]);
        }
        const token = jsonwebtoken_1.default.sign({
            userId: userId,
            email: email
        }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: {
                id: userId,
                name,
                email,
                company_name: companyName,
                cnpj,
                business_type: businessType
            }
        });
        logger_1.logger.info(`Usuário registrado com sucesso: ${email}`);
        return;
    }
    catch (error) {
        logger_1.logger.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map