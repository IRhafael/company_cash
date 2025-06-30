import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  db: Database;
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

// POST /api/auth/register
router.post('/register', async (req: any, res: Response) => {
  try {
    const { name, email, password, companyName, cnpj, businessType } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      throw createError('Nome, email e senha são obrigatórios', 400);
    }

    if (password.length < 6) {
      throw createError('Senha deve ter pelo menos 6 caracteres', 400);
    }

    // Verificar se usuário já existe
    const existingUser = await req.db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw createError('Email já cadastrado', 400);
    }

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const userId = uuidv4();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
    
    await req.db.run(
      `INSERT INTO users (id, name, email, password_hash, company_name, cnpj, business_type, avatar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, passwordHash, companyName, cnpj, businessType, avatar]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Retornar dados do usuário (sem senha)
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
  } catch (error) {
    throw error;
  }
});

// POST /api/auth/login
router.post('/login', async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      throw createError('Email e senha são obrigatórios', 400);
    }

    // Buscar usuário
    const user = await req.db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as User;

    if (!user) {
      throw createError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Credenciais inválidas', 401);
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Retornar dados do usuário (sem senha)
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
  } catch (error) {
    throw error;
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const user = await req.db.get(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    ) as User;

    if (!user) {
      throw createError('Usuário não encontrado', 404);
    }

    // Retornar dados do usuário (sem senha)
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
  } catch (error) {
    throw error;
  }
});

export default router;
