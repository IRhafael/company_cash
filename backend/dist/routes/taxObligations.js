"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.json({ message: 'GET tax obligations - TODO: implementar' });
});
router.post('/', async (req, res) => {
    res.json({ message: 'POST tax obligations - TODO: implementar' });
});
router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT tax obligations - TODO: implementar' });
});
router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE tax obligations - TODO: implementar' });
});
exports.default = router;
//# sourceMappingURL=taxObligations.js.map