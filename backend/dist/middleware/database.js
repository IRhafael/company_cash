"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachDatabase = void 0;
const server_1 = require("../server");
const attachDatabase = (req, res, next) => {
    req.db = server_1.db;
    next();
};
exports.attachDatabase = attachDatabase;
//# sourceMappingURL=database.js.map