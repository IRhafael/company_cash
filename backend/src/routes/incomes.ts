import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import db from '../database/connection.js';
import { RowDataPacket } from 'mysql2';

const router = Router();

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
    params.push(Number(limit), Number(offset));

    const [incomes] = await db.query<RowDataPacket[]>(query, params);

    // Padronizar campo date para string ISO yyyy-MM-dd
    const formattedIncomes = (incomes as any[]).map((inc) => ({
      ...inc,
      date: inc.date ? inc.date.toISOString().split('T')[0] : null,
    }));

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
    const [totalResult] = await db.query<RowDataPacket[]>(totalQuery, totalParams);
    const total = totalResult[0]?.total || 0;

    res.json({
      success: true,
      data: formattedIncomes,
      total,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        count: formattedIncomes.length
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
    const { sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes } = req.body;
    if (!sourceId || !description || !amount || !date) {
      throw createError('Fonte, descrição, valor e data são obrigatórios', 400);
    }
    if (amount <= 0) {
      throw createError('Valor deve ser maior que zero', 400);
    }
    const [sourceRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [sourceId, userId]);
    if ((sourceRows as RowDataPacket[]).length === 0) {
      throw createError('Fonte de receita não encontrada', 404);
    }
    const incomeId = uuidv4();
    await db.query(
      `INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, invoice_number, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [incomeId, userId, sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes]
    );
    const [incomeRows] = await db.query<RowDataPacket[]>(`
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.id = ?
    `, [incomeId]);
    // Padronizar campo date
    const income = (incomeRows as any[])[0];
    if (income && income.date) income.date = income.date.toISOString().split('T')[0];
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    throw error;
  }
});

// PUT /api/incomes/:id - Atualizar receita
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes } = req.body;
    const [existingRows] = await db.query<RowDataPacket[]>('SELECT id FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingRows as RowDataPacket[]).length === 0) {
      throw createError('Receita não encontrada', 404);
    }
    if (!sourceId || !description || !amount || !date) {
      throw createError('Fonte, descrição, valor e data são obrigatórios', 400);
    }
    if (amount <= 0) {
      throw createError('Valor deve ser maior que zero', 400);
    }
    const [sourceRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [sourceId, userId]);
    if ((sourceRows as RowDataPacket[]).length === 0) {
      throw createError('Fonte de receita não encontrada', 404);
    }
    await db.query(
      `UPDATE incomes SET source_id = ?, description = ?, amount = ?, date = ?, payment_method = ?, client_name = ?, invoice_number = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      [sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes, id, userId]
    );
    const [incomeRows] = await db.query<RowDataPacket[]>(`
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.id = ?
    `, [id]);
    // Padronizar campo date
    const income = (incomeRows as any[])[0];
    if (income && income.date) income.date = income.date.toISOString().split('T')[0];
    res.json({ success: true, data: income });
  } catch (error) {
    throw error;
  }
});

// DELETE /api/incomes/:id - Excluir receita
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const [existingRows] = await db.query<RowDataPacket[]>('SELECT id FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingRows as RowDataPacket[]).length === 0) {
      throw createError('Receita não encontrada', 404);
    }
    await db.query('DELETE FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true, message: 'Receita excluída com sucesso' });
  } catch (error) {
    throw error;
  }
});

export default router;
