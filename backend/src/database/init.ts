import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

export async function initializeDatabase() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company'
  });

  // Criação das tabelas principais
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      cnpj VARCHAR(32),
      business_type VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS income_sources (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      color VARCHAR(16) DEFAULT '#3B82F6',
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      color VARCHAR(16) DEFAULT '#EF4444',
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS incomes (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      source_id VARCHAR(64) NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      type ENUM('recorrente', 'unico') DEFAULT 'unico',
      status ENUM('confirmado', 'pendente', 'cancelado') DEFAULT 'confirmado',
      payment_method VARCHAR(255),
      client_name VARCHAR(255),
      invoice_number VARCHAR(255),
      project_name VARCHAR(255),
      campaign_name VARCHAR(255),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (source_id) REFERENCES income_sources(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      category_id VARCHAR(64) NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      date DATE NOT NULL,
      type ENUM('fixa', 'variavel', 'investimento') DEFAULT 'variavel',
      status ENUM('pago', 'pendente', 'vencido') DEFAULT 'pendente',
      payment_method VARCHAR(255),
      supplier VARCHAR(255),
      invoice_number VARCHAR(255),
      due_date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tax_obligations (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(255) NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(15,2),
      status ENUM('pendente', 'pago', 'vencido') DEFAULT 'pendente',
      frequency ENUM('mensal', 'bimestral', 'trimestral', 'semestral', 'anual') DEFAULT 'mensal',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  logger.info('Tabelas MySQL criadas com sucesso');
  return db;
}
