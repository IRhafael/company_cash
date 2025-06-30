import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/connection';
import { authenticateToken } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

// GET /api/expenses - Listar despesas do usuário
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const [expenses] = await db.query<RowDataPacket[]>('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC', [userId]);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
});

// POST /api/expenses - Criar nova despesa
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { categoryId, description, amount, date, type, status, paymentMethod, supplier, invoiceNumber, dueDate, notes } = req.body;
    if (!categoryId || !description || !amount || !date) {
      return res.status(400).json({ error: 'Categoria, descrição, valor e data são obrigatórios' });
    }
    const expenseId = uuidv4();
    await db.query(
      `INSERT INTO expenses (id, user_id, category_id, description, amount, date, type, status, payment_method, supplier, invoice_number, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [expenseId, userId, categoryId, description, amount, date, type || 'variavel', status || 'pendente', paymentMethod, supplier, invoiceNumber, dueDate, notes]
    );
    const [expenseRows] = await db.query<RowDataPacket[]>('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    res.status(201).json({ success: true, data: (expenseRows as RowDataPacket[])[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar despesa' });
  }
});

// PUT /api/expenses/:id - Atualizar despesa
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { categoryId, description, amount, date, type, status, paymentMethod, supplier, invoiceNumber, dueDate, notes } = req.body;
    const [existingRows] = await db.query<RowDataPacket[]>('SELECT id FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    await db.query(
      `UPDATE expenses SET category_id = ?, description = ?, amount = ?, date = ?, type = ?, status = ?, payment_method = ?, supplier = ?, invoice_number = ?, due_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      [categoryId, description, amount, date, type, status, paymentMethod, supplier, invoiceNumber, dueDate, notes, id, userId]
    );
    const [expenseRows] = await db.query<RowDataPacket[]>('SELECT * FROM expenses WHERE id = ?', [id]);
    res.json({ success: true, data: (expenseRows as RowDataPacket[])[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
});

// DELETE /api/expenses/:id - Excluir despesa
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const [existingRows] = await db.query<RowDataPacket[]>('SELECT id FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true, message: 'Despesa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir despesa' });
  }
});

export default router;
