"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { startDate, endDate, sourceId, limit = 50, offset = 0 } = req.query;
        let query = `
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ?
    `;
        const params = [userId];
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
        let totalQuery = 'SELECT SUM(amount) as total FROM incomes WHERE user_id = ?';
        const totalParams = [userId];
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
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: incomes.length
            }
        });
    }
    catch (error) {
        throw error;
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes } = req.body;
        if (!sourceId || !description || !amount || !date) {
            throw (0, errorHandler_1.createError)('Fonte, descrição, valor e data são obrigatórios', 400);
        }
        if (amount <= 0) {
            throw (0, errorHandler_1.createError)('Valor deve ser maior que zero', 400);
        }
        const source = await req.db.get('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [sourceId, userId]);
        if (!source) {
            throw (0, errorHandler_1.createError)('Fonte de receita não encontrada', 404);
        }
        const incomeId = (0, uuid_1.v4)();
        await req.db.run(`INSERT INTO incomes (
        id, user_id, source_id, description, amount, date, 
        payment_method, client_name, invoice_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            incomeId, userId, sourceId, description, amount, date,
            paymentMethod, clientName, invoiceNumber, notes
        ]);
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
    }
    catch (error) {
        throw error;
    }
});
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { sourceId, description, amount, date, paymentMethod, clientName, invoiceNumber, notes } = req.body;
        const existingIncome = await req.db.get('SELECT id FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingIncome) {
            throw (0, errorHandler_1.createError)('Receita não encontrada', 404);
        }
        if (!sourceId || !description || !amount || !date) {
            throw (0, errorHandler_1.createError)('Fonte, descrição, valor e data são obrigatórios', 400);
        }
        if (amount <= 0) {
            throw (0, errorHandler_1.createError)('Valor deve ser maior que zero', 400);
        }
        const source = await req.db.get('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [sourceId, userId]);
        if (!source) {
            throw (0, errorHandler_1.createError)('Fonte de receita não encontrada', 404);
        }
        await req.db.run(`UPDATE incomes SET 
        source_id = ?, description = ?, amount = ?, date = ?,
        payment_method = ?, client_name = ?, invoice_number = ?, notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`, [
            sourceId, description, amount, date,
            paymentMethod, clientName, invoiceNumber, notes,
            id, userId
        ]);
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
    }
    catch (error) {
        throw error;
    }
});
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const existingIncome = await req.db.get('SELECT id FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingIncome) {
            throw (0, errorHandler_1.createError)('Receita não encontrada', 404);
        }
        await req.db.run('DELETE FROM incomes WHERE id = ? AND user_id = ?', [id, userId]);
        res.json({
            success: true,
            message: 'Receita excluída com sucesso'
        });
    }
    catch (error) {
        throw error;
    }
});
exports.default = router;
//# sourceMappingURL=incomes.js.map