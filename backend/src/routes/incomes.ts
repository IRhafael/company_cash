import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface AuthRequest extends Request {
  db: any;
  userId?: string;
  body: any;
}

interface Income {
  id: string;
  user_id: string;
  source_id: string;
  description: string;
  amount: number;
  date: string;
  payment_method?: string;
  client_name?: string;
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// GET /api/incomes - Buscar receitas do usuário
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, sourceId, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ?
    `;
    const params: any[] = [userId];

    if (startDate) {
      query += ' AND i.date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND i.date <= ?';
      params.push(endDate);
    }

    if (sourceId) {
      query += ' AND i.source_id = ?';
      params.push(sourceId);
    }

    query += ' ORDER BY i.date DESC, i.created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const incomes = await req.db.all(query, params);

    // Buscar total de receitas no período
    let totalQuery = 'SELECT SUM(amount) as total FROM incomes WHERE user_id = ?';
    const totalParams: any[] = [userId];

    if (startDate) {
      totalQuery += ' AND date >= ?';
      totalParams.push(startDate);
    }

    if (endDate) {
      totalQuery += ' AND date <= ?';
      totalParams.push(endDate);
    }

    if (sourceId) {
      totalQuery += ' AND source_id = ?';
      totalParams.push(sourceId);
    }

    const totalResult = await req.db.get(totalQuery, totalParams);
    const total = totalResult?.total || 0;

    res.json({
      success: true,
      data: incomes,
      total,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        count: incomes.length
      }
    });
  } catch (error) {
    throw error;
  }
});

// POST /api/incomes - Criar nova receita
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const {
      sourceId,
      description,
      amount,
      date,
      paymentMethod,
      clientName,
      invoiceNumber,
      notes
    } = req.body;

    // Validações básicas
    if (!sourceId || !description || !amount || !date) {
      throw createError('Fonte, descrição, valor e data são obrigatórios', 400);
    }

    if (amount <= 0) {
      throw createError('Valor deve ser maior que zero', 400);
    }

    // Verificar se a fonte pertence ao usuário
    const source = await req.db.get(
      'SELECT id FROM income_sources WHERE id = ? AND user_id = ?',
      [sourceId, userId]
    );

    if (!source) {
      throw createError('Fonte de receita não encontrada', 404);
    }

    // Criar receita
    const incomeId = uuidv4();
    await req.db.run(
      `INSERT INTO incomes (
        id, user_id, source_id, description, amount, date, 
        payment_method, client_name, invoice_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incomeId, userId, sourceId, description, amount, date,
        paymentMethod, clientName, invoiceNumber, notes
      ]
    );

    // Buscar a receita criada com dados da fonte
    const income = await req.db.get(`
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.id = ?
    `, [incomeId]);

    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    throw error;
  }
});

// PUT /api/incomes/:id - Atualizar receita
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const {
      sourceId,
      description,
      amount,
      date,
      paymentMethod,
      clientName,
      invoiceNumber,
      notes
    } = req.body;

    // Verificar se a receita pertence ao usuário
    const existingIncome = await req.db.get(
      'SELECT id FROM incomes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingIncome) {
      throw createError('Receita não encontrada', 404);
    }

    // Validações básicas
    if (!sourceId || !description || !amount || !date) {
      throw createError('Fonte, descrição, valor e data são obrigatórios', 400);
    }

    if (amount <= 0) {
      throw createError('Valor deve ser maior que zero', 400);
    }

    // Verificar se a nova fonte pertence ao usuário
    const source = await req.db.get(
      'SELECT id FROM income_sources WHERE id = ? AND user_id = ?',
      [sourceId, userId]
    );

    if (!source) {
      throw createError('Fonte de receita não encontrada', 404);
    }

    // Atualizar receita
    await req.db.run(
      `UPDATE incomes SET 
        source_id = ?, description = ?, amount = ?, date = ?,
        payment_method = ?, client_name = ?, invoice_number = ?, notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [
        sourceId, description, amount, date,
        paymentMethod, clientName, invoiceNumber, notes,
        id, userId
      ]
    );

    // Buscar a receita atualizada
    const income = await req.db.get(`
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.id = ?
    `, [id]);

    res.json({
      success: true,
      data: income
    });
  } catch (error) {
    throw error;
  }
});

// DELETE /api/incomes/:id - Excluir receita
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se a receita pertence ao usuário
    const existingIncome = await req.db.get(
      'SELECT id FROM incomes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingIncome) {
      throw createError('Receita não encontrada', 404);
    }

    // Excluir receita
    await req.db.run('DELETE FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({
      success: true,
      message: 'Receita excluída com sucesso'
    });
  } catch (error) {
    throw error;
  }
});

export default router;
