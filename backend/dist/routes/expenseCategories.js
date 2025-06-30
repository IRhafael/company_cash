"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.json({ message: 'GET expense categories - TODO: implementar' });
});
router.post('/', async (req, res) => {
    res.json({ message: 'POST expense categories - TODO: implementar' });
});
router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT expense categories - TODO: implementar' });
});
router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE expense categories - TODO: implementar' });
});
exports.default = router;
//# sourceMappingURL=expenseCategories.js.map