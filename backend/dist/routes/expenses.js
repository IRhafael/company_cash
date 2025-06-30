"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.json({ message: 'GET expenses - TODO: implementar' });
});
router.post('/', async (req, res) => {
    res.json({ message: 'POST expenses - TODO: implementar' });
});
router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT expenses - TODO: implementar' });
});
router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE expenses - TODO: implementar' });
});
exports.default = router;
//# sourceMappingURL=expenses.js.map