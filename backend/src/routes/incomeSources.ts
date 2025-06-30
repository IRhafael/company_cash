import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface IncomeSource {
  id: string;
  user_id: string;
  name: string;
  type: string;
  is_active: boolean;
  color: string;
  account_code?: string;
  created_at: string;
  updated_at: string;
}

// GET /api/income-sources - Buscar fontes de receita do usuário
router.get('/', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const db = global.db;
    if (!db) {
      res.status(500).json({ error: 'Database not available' });
      return;
    }

    const userId = req.userId;
    
    const query = 'SELECT * FROM income_sources WHERE user_id = ? ORDER BY name ASC';
    const sources = await db.all(query, [userId]);

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

    // Validações básicas
    if (!name || !type || !color) {
      throw createError('Nome, tipo e cor são obrigatórios', 400);
    }

    // Verificar se já existe uma fonte com o mesmo nome
    const existingSource = await req.db.get(
      'SELECT id FROM income_sources WHERE user_id = ? AND name = ?',
      [userId, name]
    );

    if (existingSource) {
      throw createError('Já existe uma fonte de receita com este nome', 400);
    }

    // Criar fonte de receita
    const sourceId = uuidv4();
    await req.db.run(
      `INSERT INTO income_sources (id, user_id, name, type, color, account_code, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [sourceId, userId, name, type, color, accountCode]
    );

    // Buscar a fonte criada
    const source = await req.db.get(
      'SELECT * FROM income_sources WHERE id = ?',
      [sourceId]
    );

    res.status(201).json({
      success: true,
      data: source
    });
  } catch (error) {
    throw error;
  }
});

// PUT /api/income-sources/:id - Atualizar fonte de receita
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, type, color, accountCode, isActive } = req.body;

    // Verificar se a fonte pertence ao usuário
    const existingSource = await req.db.get(
      'SELECT id FROM income_sources WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingSource) {
      throw createError('Fonte de receita não encontrada', 404);
    }

    // Validações básicas
    if (!name || !type || !color) {
      throw createError('Nome, tipo e cor são obrigatórios', 400);
    }

    // Verificar se já existe outra fonte com o mesmo nome
    const duplicateSource = await req.db.get(
      'SELECT id FROM income_sources WHERE user_id = ? AND name = ? AND id != ?',
      [userId, name, id]
    );

    if (duplicateSource) {
      throw createError('Já existe uma fonte de receita com este nome', 400);
    }

    // Atualizar fonte de receita
    await req.db.run(
      `UPDATE income_sources SET 
        name = ?, type = ?, color = ?, account_code = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [name, type, color, accountCode, isActive ? 1 : 0, id, userId]
    );

    // Buscar a fonte atualizada
    const source = await req.db.get(
      'SELECT * FROM income_sources WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: source
    });
  } catch (error) {
    throw error;
  }
});

// DELETE /api/income-sources/:id - Excluir fonte de receita
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se a fonte pertence ao usuário
    const existingSource = await req.db.get(
      'SELECT id FROM income_sources WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingSource) {
      throw createError('Fonte de receita não encontrada', 404);
    }

    // Verificar se existem receitas vinculadas
    const linkedIncomes = await req.db.get(
      'SELECT COUNT(*) as count FROM incomes WHERE source_id = ?',
      [id]
    );

    if (linkedIncomes.count > 0) {
      throw createError('Não é possível excluir uma fonte que possui receitas vinculadas. Desative-a ao invés de excluir.', 400);
    }

    // Excluir fonte de receita
    await req.db.run(
      'DELETE FROM income_sources WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Fonte de receita excluída com sucesso'
    });
  } catch (error) {
    throw error;
  }
});

export default router;
