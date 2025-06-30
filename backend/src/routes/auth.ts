import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  db?: Database;
  userId?: string;
  body: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  company_name?: string;
  cnpj?: string;
  business_type?: string;
  avatar?: string;
  created_at: string;
}

// Função para criar fontes e categorias padrão para um novo usuário
async function createDefaultSourcesAndCategories(userId: string) {
  const db = global.db;
  if (!db) throw new Error('Database not available');

  try {
    // Copiar fontes de receita padrão
    const defaultSources = await db.all(
      'SELECT name, type, color, account_code FROM income_sources WHERE user_id = "default"'
    );
    
    for (const source of defaultSources) {
      await db.run(
        'INSERT INTO income_sources (id, user_id, name, type, color, account_code) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, source.name, source.type, source.color, source.account_code]
      );
    }

    // Copiar categorias de despesa padrão
    const defaultCategories = await db.all(
      'SELECT name, color, account_code FROM expense_categories WHERE user_id = "default"'
    );
    
    for (const category of defaultCategories) {
      await db.run(
        'INSERT INTO expense_categories (id, user_id, name, color, account_code) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), userId, category.name, category.color, category.account_code]
      );
    }
  } catch (error) {
    console.error('Erro ao criar dados padrão:', error);
    throw error;
  }
}

// Registro
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const db = global.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { name, email, password, companyName, cnpj, businessType } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se o usuário já existe
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário já existe com este email' });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const userId = uuidv4();
    await db.run(
      'INSERT INTO users (id, name, email, password_hash, company_name, cnpj, business_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, companyName, cnpj, businessType, new Date().toISOString()]
    );

    // Criar fontes e categorias padrão
    await createDefaultSourcesAndCategories(userId);

    // Gerar token JWT
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Buscar o usuário criado
    const user = await db.get(
      'SELECT id, name, email, company_name as companyName, cnpj, business_type as businessType FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user,
      token
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const db = global.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as User;
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Retornar dados do usuário (sem senha)
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

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter dados do usuário atual
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = global.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const user = await db.get(
      'SELECT id, name, email, company_name as companyName, cnpj, business_type as businessType FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
