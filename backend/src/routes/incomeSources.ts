import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import db from '../database/connection';
import { RowDataPacket } from 'mysql2';

const router = Router();

// GET /api/income-sources - Buscar fontes de receita do usuário
router.get('/', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const [sources] = await db.query<RowDataPacket[]>('SELECT * FROM income_sources WHERE user_id = ? ORDER BY name ASC', [userId]);
    res.json(sources);
  } catch (error) {
    console.error('Erro ao buscar fontes de receita:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/income-sources - Criar nova fonte de receita
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { name, type, color, accountCode } = req.body;
    if (!name || !type || !color) {
      return res.status(400).json({ error: 'Nome, tipo e cor são obrigatórios' });
    }
    const [existingSourceRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE user_id = ? AND name = ?', [userId, name]);
    if ((existingSourceRows as RowDataPacket[]).length > 0) {
      return res.status(400).json({ error: 'Já existe uma fonte de receita com este nome' });
    }
    const sourceId = uuidv4();
    await db.query(
      `INSERT INTO income_sources (id, user_id, name, type, color, account_code, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [sourceId, userId, name, type, color, accountCode]
    );
    const [sourceRows] = await db.query<RowDataPacket[]>('SELECT * FROM income_sources WHERE id = ?', [sourceId]);
    res.status(201).json({ success: true, data: (sourceRows as RowDataPacket[])[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fonte de receita' });
  }
});

// PUT /api/income-sources/:id - Atualizar fonte de receita
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, type, color, accountCode, isActive } = req.body;
    const [existingSourceRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingSourceRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: 'Fonte de receita não encontrada' });
    }
    if (!name || !type || !color) {
      return res.status(400).json({ error: 'Nome, tipo e cor são obrigatórios' });
    }
    const [duplicateRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE user_id = ? AND name = ? AND id != ?', [userId, name, id]);
    if ((duplicateRows as RowDataPacket[]).length > 0) {
      return res.status(400).json({ error: 'Já existe uma fonte de receita com este nome' });
    }
    await db.query(
      `UPDATE income_sources SET name = ?, type = ?, color = ?, account_code = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      [name, type, color, accountCode, isActive ? 1 : 0, id, userId]
    );
    const [sourceRows] = await db.query<RowDataPacket[]>('SELECT * FROM income_sources WHERE id = ?', [id]);
    res.json({ success: true, data: (sourceRows as RowDataPacket[])[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fonte de receita' });
  }
});

// DELETE /api/income-sources/:id - Excluir fonte de receita
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const [existingSourceRows] = await db.query<RowDataPacket[]>('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
    if ((existingSourceRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: 'Fonte de receita não encontrada' });
    }
    const [linkedIncomesRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM incomes WHERE source_id = ?', [id]);
    const linkedIncomes = (linkedIncomesRows as RowDataPacket[])[0];
    if (linkedIncomes && linkedIncomes.count > 0) {
      return res.status(400).json({ error: 'Não é possível excluir uma fonte que possui receitas vinculadas. Desative-a ao invés de excluir.' });
    }
    await db.query('DELETE FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true, message: 'Fonte de receita excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir fonte de receita' });
  }
});

export default router;
