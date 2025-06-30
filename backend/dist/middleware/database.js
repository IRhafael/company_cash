"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachDatabase = void 0;
const attachDatabase = (req, res, next) => {
    req.db = global.db;
    next();
};
exports.attachDatabase = attachDatabase;
//# sourceMappingURL=database.js.map