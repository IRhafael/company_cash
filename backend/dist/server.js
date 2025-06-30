"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const init_1 = require("./database/init");
const database_1 = require("./middleware/database");
const auth_1 = __importDefault(require("./routes/auth"));
const incomes_1 = __importDefault(require("./routes/incomes"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const taxObligations_1 = __importDefault(require("./routes/taxObligations"));
const incomeSources_1 = __importDefault(require("./routes/incomeSources"));
const expenseCategories_1 = __importDefault(require("./routes/expenseCategories"));
const reports_1 = __importDefault(require("./routes/reports"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas tentativas, tente novamente em 15 minutos'
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(database_1.attachDatabase);
app.use('/api/auth', auth_1.default);
app.use('/api/incomes', incomes_1.default);
app.use('/api/expenses', expenses_1.default);
app.use('/api/tax-obligations', taxObligations_1.default);
app.use('/api/income-sources', incomeSources_1.default);
app.use('/api/expense-categories', expenseCategories_1.default);
app.use('/api/reports', reports_1.default);
app.use(errorHandler_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});
async function startServer() {
    try {
        exports.db = await (0, init_1.initializeDatabase)();
        global.db = exports.db;
        logger_1.logger.info('Base de dados inicializada com sucesso');
        app.listen(PORT, () => {
            logger_1.logger.info(`Servidor rodando na porta ${PORT}`);
            logger_1.logger.info(`API disponível em http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        logger_1.logger.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}
process.on('SIGINT', async () => {
    logger_1.logger.info('Encerrando servidor...');
    if (exports.db) {
        await exports.db.close();
    }
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger_1.logger.info('Encerrando servidor...');
    if (exports.db) {
        await exports.db.close();
    }
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map