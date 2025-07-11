import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init';
import authRoutes from './routes/auth';
import incomeRoutes from './routes/incomes';
import expenseRoutes from './routes/expenses';
import taxObligationRoutes from './routes/taxObligations';
import incomeSourceRoutes from './routes/incomeSources';
import expenseCategoryRoutes from './routes/expenseCategories';
import reportRoutes from './routes/reports';
import importNfeXmlRouter from './routes/importNfeXml';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Muitas tentativas, tente novamente em 15 minutos'
});

// Middleware
app.use(helmet());
app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', 
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/tax-obligations', taxObligationRoutes);
app.use('/api/income-sources', incomeSourceRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/import', importNfeXmlRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar banco e iniciar servidor
async function startServer() {
  try {
    await initializeDatabase(); // Garante que as tabelas existem
    logger.info('Base de dados inicializada com sucesso');
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      logger.info(`API disponível em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Encerrando servidor...');
  process.exit(0);
});

startServer();

export default app;
