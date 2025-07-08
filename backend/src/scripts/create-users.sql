-- Limpar usuários existentes
DELETE FROM users WHERE email = 'devrhafael@outlook.com';
DELETE FROM users WHERE email = 'demo@example.com';
DELETE FROM users WHERE email = 'teste@example.com';
DELETE FROM users WHERE email = 'admin@company.com';

-- Inserir usuários com senhas hashadas
-- Usuário: Italo (devrhafael@outlook.com) - Senha: Viver321
INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES
('user-italo-1751997790402', 'Italo', 'devrhafael@outlook.com', '$2a$10$ucKfyHiqLn1cS66LCNGl/u2khNqt6Ce8fr6MwMtESonOlmMsOSBFa', 'Italo Contabilidade', '12.345.678/0001-90', 'Serviços', NOW());

-- Usuário: Demo (demo@example.com) - Senha: demo123
INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES
('user-demo-1751997790468', 'Demo', 'demo@example.com', '$2a$10$Iq7PQeuB/EtlY9/nN7Dc5ePPYITJg7Cc5FBmvmWhBq1JMXf4bctsO', 'Demo Ltda', '12.345.678/0001-90', 'Serviços', NOW());

-- Usuário: Teste (teste@example.com) - Senha: teste123
INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES
('user-teste-1751997790531', 'Teste', 'teste@example.com', '$2a$10$0jmcMh.h0JHqPrYt1ovhrus19YQfnu51.nSVc6OpDL16dbF72/nlC', 'Teste Corp', '12.345.678/0001-90', 'Serviços', NOW());

-- Usuário: Admin (admin@company.com) - Senha: admin123
INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES
('user-admin-1751997790596', 'Admin', 'admin@company.com', '$2a$10$s1frztGqLnPfTee3qaxzw.sRYFlRJnmVD1kNI8cKa0izUA6kVpQ4u', 'Admin Corp', '12.345.678/0001-90', 'Serviços', NOW());

-- Verificar usuários inseridos
SELECT email, name, company_name FROM users ORDER BY created_at DESC;
