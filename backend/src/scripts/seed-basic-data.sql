-- Limpar dados existentes (cuidado em produção)
DELETE FROM incomes WHERE user_id IN (SELECT id FROM users WHERE email = 'demo@example.com');
DELETE FROM income_sources WHERE user_id IN (SELECT id FROM users WHERE email = 'demo@example.com');
DELETE FROM users WHERE email = 'demo@example.com';

-- Inserir usuário de teste
INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES 
('user-demo-123', 'Empresa Demo', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Ltda', '12.345.678/0001-90', 'Serviços', NOW());

-- Inserir fontes de receita padrão
INSERT INTO income_sources (id, user_id, name, type, description, color, is_active, created_at) VALUES 
('src-vendas-demo', 'user-demo-123', 'Vendas de Produtos', 'vendas', 'Receitas de vendas de produtos', '#10B981', 1, NOW()),
('src-servicos-demo', 'user-demo-123', 'Prestação de Serviços', 'servicos', 'Receitas de prestação de serviços', '#3B82F6', 1, NOW()),
('src-consultoria-demo', 'user-demo-123', 'Consultoria', 'servicos', 'Receitas de consultoria especializada', '#8B5CF6', 1, NOW());

-- Inserir algumas receitas de exemplo
INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, invoice_number, notes, created_at) VALUES 
('inc-1-demo', 'user-demo-123', 'src-vendas-demo', 'Venda de produtos janeiro', 5000.00, '2025-01-15', 'PIX', 'Cliente ABC Ltda', 'NF-001', 'Venda realizada com sucesso', NOW()),
('inc-2-demo', 'user-demo-123', 'src-servicos-demo', 'Desenvolvimento de sistema', 8000.00, '2025-01-20', 'Transferência', 'Tech Solutions', 'NF-002', 'Projeto de desenvolvimento web', NOW()),
('inc-3-demo', 'user-demo-123', 'src-consultoria-demo', 'Consultoria estratégica', 3500.00, '2025-01-25', 'Boleto', 'Startup XYZ', 'NF-003', 'Consultoria em estratégia de negócios', NOW());

-- Verificar se os dados foram inseridos
SELECT 'Usuários inseridos:' as info, COUNT(*) as count FROM users WHERE email = 'demo@example.com'
UNION ALL
SELECT 'Fontes de receita inseridas:', COUNT(*) FROM income_sources WHERE user_id = 'user-demo-123'
UNION ALL  
SELECT 'Receitas inseridas:', COUNT(*) FROM incomes WHERE user_id = 'user-demo-123';
