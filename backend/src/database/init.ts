import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { logger } from '../utils/logger';

export async function initializeDatabase(): Promise<Database> {
  const dbPath = process.env.DATABASE_PATH || './database.sqlite';
  
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Habilitar foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Criar tabelas
    await createTables(db);
    
    logger.info('Base de dados inicializada com sucesso');
    return db;
  } catch (error) {
    logger.error('Erro ao inicializar base de dados:', error);
    throw error;
  }
}

async function createTables(db: Database) {
  // Tabela de usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company_name TEXT,
      cnpj TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabela de fontes de receita
  await db.exec(`
    CREATE TABLE IF NOT EXISTS income_sources (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      color TEXT NOT NULL,
      account_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Tabela de categorias de despesa
  await db.exec(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT,
      is_default BOOLEAN DEFAULT 0,
      type TEXT NOT NULL,
      account_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Tabela de receitas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      source_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      payment_method TEXT,
      client_name TEXT,
      invoice_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (source_id) REFERENCES income_sources(id) ON DELETE RESTRICT
    );
  `);

  // Tabela de despesas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      payment_method TEXT,
      supplier TEXT,
      document_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE RESTRICT
    );
  `);

  // Tabela de obrigações tributárias
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tax_obligations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      due_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Criar índices para performance
  await db.exec('CREATE INDEX IF NOT EXISTS idx_incomes_user_date ON incomes(user_id, date);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_tax_obligations_user_due_date ON tax_obligations(user_id, due_date);');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
}
