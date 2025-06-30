import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { authenticateToken } from '../middleware/auth';
import db from '../database/connection';
import { RowDataPacket } from 'mysql2';

// Extende a interface Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

const router = express.Router();

// Interface para o usuário
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  company_name: string;
  cnpj?: string;
  business_type?: string;
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    const [users] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as RowDataPacket[])[0];

    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    if (!user.password) {
      logger.error(`Usuário ${email} tem senha null/undefined no banco`);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
    logger.info(`Login bem-sucedido para: ${email}`);
    return;
  } catch (error) {
    logger.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName, cnpj, businessType } = req.body;

    if (!name || !email || !password || !companyName) {
      res.status(400).json({ 
        error: 'Nome, email, senha e nome da empresa são obrigatórios' 
      });
      return;
    }

    const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    if ((existing as RowDataPacket[]).length > 0) {
      res.status(409).json({ error: 'Usuário já existe com este email' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = uuidv4();
    
    await db.query(
      'INSERT INTO users (id, name, email, password, company_name, cnpj, business_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, companyName, cnpj || null, businessType || null]
    );

    const defaultIncomeSources = [
      { name: 'Honorários Contábeis', description: 'Receitas de serviços contábeis regulares', color: '#3B82F6' },
      { name: 'Consultoria Tributária', description: 'Receitas de consultoria em tributos', color: '#10B981' },
      { name: 'Serviços Diversos', description: 'Outras receitas de serviços', color: '#F59E0B' }
    ];

    for (const source of defaultIncomeSources) {
      await db.query(
        'INSERT INTO income_sources (id, user_id, name, description, color, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, source.name, source.description, source.color, 1]
      );
    }

    const defaultExpenseCategories = [
      { name: 'Aluguel', description: 'Aluguel do escritório', color: '#DC2626' },
      { name: 'Funcionários', description: 'Salários e encargos', color: '#7C3AED' },
      { name: 'Despesas Operacionais', description: 'Outras despesas operacionais', color: '#059669' }
    ];

    for (const category of defaultExpenseCategories) {
      await db.query(
        'INSERT INTO expense_categories (id, user_id, name, description, color, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, category.name, category.description, category.color, 1]
      );
    }

    const token = jwt.sign(
      { 
        userId: userId,
        email: email 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

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
    logger.info(`Usuário registrado com sucesso: ${email}`);
    return;
  } catch (error) {
    logger.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
});

// Rota para obter usuário autenticado
// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.userId);
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    const [users] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);
    const user = (users as RowDataPacket[])[0];
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário autenticado' });
    return;
  }
  return;
});

export default router;
