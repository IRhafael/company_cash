-- Verificar se a tabela tax_obligations existe e criar se necessário
USE company;

-- Verificar tabelas existentes
SHOW TABLES;

-- Criar tabela tax_obligations se não existir
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
  tax_type VARCHAR(255),
  reference_month VARCHAR(7),
  notes TEXT,
  compliance_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verificar estrutura da tabela
DESCRIBE tax_obligations;
