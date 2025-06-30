import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/connection';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/expense-categories - Listar categorias do usuário
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const [categories] = await db.query('SELECT * FROM expense_categories WHERE user_id = ? ORDER BY name ASC', [userId]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// POST /api/expense-categories - Criar nova categoria
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { name, color, description, isActive } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Nome e cor são obrigatórios' });
    }
    const categoryId = uuidv4();
    await db.query(
      `INSERT INTO expense_categories (id, user_id, name, color, description, is_active) VALUES (?, ?, ?, ?, ?, ?)` ,
      [categoryId, userId, name, color, description, isActive ? 1 : 1]
    );
    const [categoryRows]: [any[], any] = await db.query('SELECT * FROM expense_categories WHERE id = ?', [categoryId]);
    res.status(201).json({ success: true, data: categoryRows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// PUT /api/expense-categories/:id - Atualizar categoria
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, color, description, isActive } = req.body;
    const [existingRows]: [any[], any] = await db.query('SELECT id FROM expense_categories WHERE id = ? AND user_id = ?', [id, userId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await db.query(
      `UPDATE expense_categories SET name = ?, color = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      [name, color, description, isActive ? 1 : 0, id, userId]
    );
    const [categoryRows]: [any[], any] = await db.query('SELECT * FROM expense_categories WHERE id = ?', [id]);
    res.json({ success: true, data: categoryRows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// DELETE /api/expense-categories/:id - Excluir categoria
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const [existingRows]: [any[], any] = await db.query('SELECT id FROM expense_categories WHERE id = ? AND user_id = ?', [id, userId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    await db.query('DELETE FROM expense_categories WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true, message: 'Categoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir categoria' });
    return;
  }
});

export default router;
