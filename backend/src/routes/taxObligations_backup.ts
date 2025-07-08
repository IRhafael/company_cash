import { Router, R    const obligations = (rows as any[]).map(row => ({
      id: row.id,
      title: row.name,  // name no banco -> title no frontend
      description: row.description,
      amount: row.amount,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
      status: row.status,
      category: row.type,  // type no banco -> category no frontend
      taxType: row.tax_type || row.type,
      referenceMonth: row.reference_month,
      complianceDate: row.compliance_date ? row.compliance_date.toISOString().split('T')[0] : null,
      notes: row.notes,
      frequency: row.frequency,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })); Response } from 'express';
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
    const { title, description, amount, dueDate, taxType, status, referenceMonth, notes, complianceDate, category, priority } = req.body;
    
    console.log('📥 Dados recebidos para obrigação tributária:', req.body);
    
    if (!title || !dueDate || !status || !priority || !category) {
      console.error('❌ Campos obrigatórios faltando:', { title, dueDate, status, priority, category });
      res.status(400).json({ 
        error: 'Título, data de vencimento, status, prioridade e categoria são obrigatórios',
        details: { title, dueDate, status, priority, category }
      });
      return;
    }
    
    const id = uuidv4();
    console.log('🔄 Criando obrigação com ID:', id);
    
    await db.query(
      `INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, frequency, reference_month, notes, compliance_date, tax_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        userId, 
        title,  // name na tabela
        description, 
        category,  // type na tabela
        dueDate, 
        amount, 
        status || 'pendente', 
        'mensal',  // frequency padrão
        referenceMonth, 
        notes || null, 
        complianceDate || null,
        taxType || category
      ]
    );
    
    console.log('✅ Obrigação criada com sucesso');
    
    res.status(201).json({ 
      success: true,
      data: { 
        id, 
        title, 
        description, 
        amount, 
        dueDate, 
        taxType: taxType || category, 
        status: status || 'pendente', 
        referenceMonth, 
        notes, 
        complianceDate,
        category,
        priority
      }
    });
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
