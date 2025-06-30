import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/connection';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET todas as obrigações tributárias do usuário autenticado
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const { logger } = require('../utils/logger');
  try {
    const userId = (req as any).userId;
    logger.info('Recebida requisição para buscar obrigações tributárias', { userId });
    const [rows] = await db.query(
      'SELECT id, description, amount, due_date, tax_type, status, reference_month, notes, compliance_date FROM tax_obligations WHERE user_id = ? ORDER BY due_date DESC',
      [userId]
    );
    // Padroniza datas para string ISO yyyy-MM-dd
    const obligations = (rows as any[]).map((row) => ({
      ...row,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
      taxType: row.tax_type,
      referenceMonth: row.reference_month,
      complianceDate: row.compliance_date ? row.compliance_date.toISOString().split('T')[0] : null,
    }));
    logger.info('Obrigações tributárias retornadas', { count: obligations.length });
    res.json(obligations);
  } catch (error) {
    logger.error('Erro ao buscar obrigações tributárias', error);
    res.status(500).json({ error: 'Erro ao buscar obrigações tributárias' });
  }
});

// POST criar nova obrigação tributária
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { description, amount, dueDate, taxType, status, referenceMonth, notes, complianceDate } = req.body;
    if (!description || !amount || !dueDate || !taxType || !referenceMonth) {
      res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      return;
    }
    const id = uuidv4();
    await db.query(
      `INSERT INTO tax_obligations (id, user_id, description, amount, due_date, tax_type, status, reference_month, notes, compliance_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, description, amount, dueDate, taxType, status || 'pendente', referenceMonth, notes || null, complianceDate || null]
    );
    res.status(201).json({ id, description, amount, dueDate, taxType, status: status || 'pendente', referenceMonth, notes, complianceDate });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar obrigação tributária' });
    return;
  }
});

// PUT atualizar obrigação tributária
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { description, amount, dueDate, taxType, status, referenceMonth, notes, complianceDate } = req.body;
    const [result] = await db.query(
      `UPDATE tax_obligations SET description=?, amount=?, due_date=?, tax_type=?, status=?, reference_month=?, notes=?, compliance_date=? WHERE id=? AND user_id=?`,
      [description, amount, dueDate, taxType, status, referenceMonth, notes, complianceDate, id, userId]
    );
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Obrigação não encontrada' });
    }
    return res.json({ id, description, amount, dueDate, taxType, status, referenceMonth, notes, complianceDate });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar obrigação tributária' });
  }
});

// DELETE obrigação tributária
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tax_obligations WHERE id=? AND user_id=?', [id, userId]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Obrigação não encontrada' });
    }
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir obrigação tributária' });
    return;
  }
});

export default router;
