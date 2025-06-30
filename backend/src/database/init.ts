import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

export async function initializeDatabase(): Promise<Database> {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Criar tabelas
  await db.exec(`
    -- Tabela de usuários
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company_name TEXT,
      cnpj TEXT,
      business_type TEXT,
      avatar TEXT,
      created_at TEXT NOT NULL
    );

    -- Tabela de fontes de receita
    CREATE TABLE IF NOT EXISTS income_sources (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color TEXT NOT NULL,
      account_code TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    -- Tabela de categorias de despesa
    CREATE TABLE IF NOT EXISTS expense_categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      account_code TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    -- Tabela de receitas
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      source_id TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      project_name TEXT,
      campaign_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (source_id) REFERENCES income_sources (id)
    );

    -- Tabela de despesas
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category_id TEXT NOT NULL,
      type TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      project_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (category_id) REFERENCES expense_categories (id)
    );

    -- Tabela de obrigações fiscais
    CREATE TABLE IF NOT EXISTS tax_obligations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      amount REAL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Verificar se as colunas existem e adicionar se necessário
  const userColumns = await db.all("PRAGMA table_info(users)");
  const hasBusinessType = userColumns.some(col => col.name === 'business_type');
  const hasCompanyName = userColumns.some(col => col.name === 'company_name');
  const hasCnpj = userColumns.some(col => col.name === 'cnpj');

  if (!hasBusinessType) {
    await db.exec("ALTER TABLE users ADD COLUMN business_type TEXT");
  }
  if (!hasCompanyName) {
    await db.exec("ALTER TABLE users ADD COLUMN company_name TEXT");
  }
  if (!hasCnpj) {
    await db.exec("ALTER TABLE users ADD COLUMN cnpj TEXT");
  }

  // Verificar e adicionar colunas em incomes se necessário
  const incomeColumns = await db.all("PRAGMA table_info(incomes)");
  const hasProjectName = incomeColumns.some(col => col.name === 'project_name');
  const hasCampaignName = incomeColumns.some(col => col.name === 'campaign_name');

  if (!hasProjectName) {
    await db.exec("ALTER TABLE incomes ADD COLUMN project_name TEXT");
  }
  if (!hasCampaignName) {
    await db.exec("ALTER TABLE incomes ADD COLUMN campaign_name TEXT");
  }

  return db;
}
