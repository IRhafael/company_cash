"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/financial-summary', async (req, res) => {
    res.json({ message: 'GET financial summary - TODO: implementar' });
});
router.get('/monthly-data', async (req, res) => {
    res.json({ message: 'GET monthly data - TODO: implementar' });
});
router.get('/export', async (req, res) => {
    res.json({ message: 'GET export data - TODO: implementar' });
});
exports.default = router;
//# sourceMappingURL=reports.js.map