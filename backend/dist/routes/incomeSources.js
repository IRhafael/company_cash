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
        const { includeInactive = false } = req.query;
        let query = 'SELECT * FROM income_sources WHERE user_id = ?';
        const params = [userId];
        if (!includeInactive) {
            query += ' AND is_active = 1';
        }
        query += ' ORDER BY name ASC';
        const sources = await req.db.all(query, params);
        res.json({
            success: true,
            data: sources
        });
    }
    catch (error) {
        throw error;
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, type, color, accountCode } = req.body;
        if (!name || !type || !color) {
            throw (0, errorHandler_1.createError)('Nome, tipo e cor são obrigatórios', 400);
        }
        const existingSource = await req.db.get('SELECT id FROM income_sources WHERE user_id = ? AND name = ?', [userId, name]);
        if (existingSource) {
            throw (0, errorHandler_1.createError)('Já existe uma fonte de receita com este nome', 400);
        }
        const sourceId = (0, uuid_1.v4)();
        await req.db.run(`INSERT INTO income_sources (id, user_id, name, type, color, account_code, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`, [sourceId, userId, name, type, color, accountCode]);
        const source = await req.db.get('SELECT * FROM income_sources WHERE id = ?', [sourceId]);
        res.status(201).json({
            success: true,
            data: source
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
        const { name, type, color, accountCode, isActive } = req.body;
        const existingSource = await req.db.get('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingSource) {
            throw (0, errorHandler_1.createError)('Fonte de receita não encontrada', 404);
        }
        if (!name || !type || !color) {
            throw (0, errorHandler_1.createError)('Nome, tipo e cor são obrigatórios', 400);
        }
        const duplicateSource = await req.db.get('SELECT id FROM income_sources WHERE user_id = ? AND name = ? AND id != ?', [userId, name, id]);
        if (duplicateSource) {
            throw (0, errorHandler_1.createError)('Já existe uma fonte de receita com este nome', 400);
        }
        await req.db.run(`UPDATE income_sources SET 
        name = ?, type = ?, color = ?, account_code = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`, [name, type, color, accountCode, isActive ? 1 : 0, id, userId]);
        const source = await req.db.get('SELECT * FROM income_sources WHERE id = ?', [id]);
        res.json({
            success: true,
            data: source
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
        const existingSource = await req.db.get('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingSource) {
            throw (0, errorHandler_1.createError)('Fonte de receita não encontrada', 404);
        }
        const linkedIncomes = await req.db.get('SELECT COUNT(*) as count FROM incomes WHERE source_id = ?', [id]);
        if (linkedIncomes.count > 0) {
            throw (0, errorHandler_1.createError)('Não é possível excluir uma fonte que possui receitas vinculadas. Desative-a ao invés de excluir.', 400);
        }
        await req.db.run('DELETE FROM income_sources WHERE id = ? AND user_id = ?', [id, userId]);
        res.json({
            success: true,
            message: 'Fonte de receita excluída com sucesso'
        });
    }
    catch (error) {
        throw error;
    }
});
exports.default = router;
//# sourceMappingURL=incomeSources.js.map