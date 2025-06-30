import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

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

// Middleware para acessar o banco de dados
declare global {
  var db: any;
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    const [users] = await global.db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

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

    const [existing] = await global.db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      res.status(409).json({ error: 'Usuário já existe com este email' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = uuidv4();
    
    await global.db.query(
      'INSERT INTO users (id, name, email, password, company_name, cnpj, business_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, companyName, cnpj || null, businessType || null]
    );

    const defaultIncomeSources = [
      { name: 'Honorários Contábeis', description: 'Receitas de serviços contábeis regulares', color: '#3B82F6' },
      { name: 'Consultoria Tributária', description: 'Receitas de consultoria em tributos', color: '#10B981' },
      { name: 'Serviços Diversos', description: 'Outras receitas de serviços', color: '#F59E0B' }
    ];

    for (const source of defaultIncomeSources) {
      await global.db.query(
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
      await global.db.query(
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

export default router;
