"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../utils/logger");
async function initializeDatabase() {
    const dbPath = path_1.default.join(__dirname, '../../database.sqlite');
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
    await db.exec('PRAGMA foreign_keys = ON');
    await createTables(db);
    await seedDatabase(db);
    logger_1.logger.info('Base de dados inicializada e populada com sucesso');
    return db;
}
async function createTables(db) {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      company_name TEXT NOT NULL,
      cnpj TEXT,
      business_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS income_sources (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#3B82F6',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#EF4444',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      source_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      type TEXT CHECK(type IN ('recorrente', 'unico')) DEFAULT 'unico',
      status TEXT CHECK(status IN ('confirmado', 'pendente', 'cancelado')) DEFAULT 'confirmado',
      payment_method TEXT,
      client_name TEXT,
      invoice_number TEXT,
      project_name TEXT,
      campaign_name TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (source_id) REFERENCES income_sources (id) ON DELETE CASCADE
    )
  `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      type TEXT CHECK(type IN ('fixa', 'variavel', 'investimento')) DEFAULT 'variavel',
      status TEXT CHECK(status IN ('pago', 'pendente', 'vencido')) DEFAULT 'pendente',
      payment_method TEXT,
      supplier TEXT,
      invoice_number TEXT,
      due_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES expense_categories (id) ON DELETE CASCADE
    )
  `);
    await db.exec(`
    CREATE TABLE IF NOT EXISTS tax_obligations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(15,2),
      status TEXT CHECK(status IN ('pendente', 'pago', 'vencido')) DEFAULT 'pendente',
      frequency TEXT CHECK(frequency IN ('mensal', 'bimestral', 'trimestral', 'semestral', 'anual')) DEFAULT 'mensal',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
    logger_1.logger.info('Tabelas criadas com sucesso');
}
async function seedDatabase(db) {
    try {
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', ['teste@teste.com']);
        if (!existingUser) {
            const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
            const userId = 'user-test-123';
            await db.run(`
        INSERT INTO users (id, name, email, password, company_name, cnpj, business_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [userId, 'Usuário Teste', 'teste@teste.com', hashedPassword, 'Empresa Teste', '12.345.678/0001-90', 'Escritório de Contabilidade']);
            const incomeSources = [
                { id: 'source-1', name: 'Honorários Contábeis', description: 'Receitas de serviços contábeis regulares', color: '#3B82F6' },
                { id: 'source-2', name: 'Consultoria Tributária', description: 'Receitas de consultoria em tributos', color: '#10B981' },
                { id: 'source-3', name: 'Abertura de Empresas', description: 'Receitas de constituição empresarial', color: '#F59E0B' },
                { id: 'source-4', name: 'Auditoria', description: 'Receitas de serviços de auditoria', color: '#8B5CF6' },
                { id: 'source-5', name: 'Perícia Contábil', description: 'Receitas de perícias judiciais', color: '#EF4444' },
                { id: 'source-6', name: 'Terceirização Fiscal', description: 'Receitas de gestão fiscal terceirizada', color: '#14B8A6' },
                { id: 'source-7', name: 'Cursos e Treinamentos', description: 'Receitas de capacitação profissional', color: '#F97316' },
                { id: 'source-8', name: 'Produtos Digitais', description: 'Receitas de venda de produtos digitais', color: '#84CC16' }
            ];
            for (const source of incomeSources) {
                await db.run(`
          INSERT INTO income_sources (id, user_id, name, description, color, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [source.id, userId, source.name, source.description, source.color, 1]);
            }
            const expenseCategories = [
                { id: 'category-1', name: 'Aluguel', description: 'Aluguel do escritório e espaços', color: '#DC2626' },
                { id: 'category-2', name: 'Funcionários', description: 'Salários e encargos trabalhistas', color: '#7C3AED' },
                { id: 'category-3', name: 'Marketing', description: 'Investimentos em marketing e publicidade', color: '#059669' },
                { id: 'category-4', name: 'Tecnologia', description: 'Software, hardware e sistemas', color: '#2563EB' },
                { id: 'category-5', name: 'Educação', description: 'Cursos, certificações e capacitação', color: '#D97706' },
                { id: 'category-6', name: 'Viagens', description: 'Deslocamentos e hospedagem', color: '#0891B2' },
                { id: 'category-7', name: 'Material de Escritório', description: 'Papelaria e suprimentos', color: '#65A30D' },
                { id: 'category-8', name: 'Impostos', description: 'Impostos e taxas diversas', color: '#DC2626' }
            ];
            for (const category of expenseCategories) {
                await db.run(`
          INSERT INTO expense_categories (id, user_id, name, description, color, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [category.id, userId, category.name, category.description, category.color, 1]);
            }
            logger_1.logger.info('Base de dados populada com dados padrão');
        }
        else {
            const user = await db.get('SELECT password FROM users WHERE email = ?', ['teste@teste.com']);
            if (!user.password) {
                const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
                await db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'teste@teste.com']);
                logger_1.logger.info('Senha do usuário de teste atualizada');
            }
            else {
                logger_1.logger.info('Usuário de teste já existe, pulando seed');
            }
        }
    }
    catch (error) {
        logger_1.logger.error('Erro ao popular base de dados:', error);
        throw error;
    }
}
//# sourceMappingURL=init.js.map