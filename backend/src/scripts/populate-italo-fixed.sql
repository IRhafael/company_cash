-- Script corrigido para inserir dados completos para o usuário italo
-- Primeiro vamos criar as fontes de receita e categorias de despesa necessárias

-- ID do usuário italo
SET @user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6';

-- ================================
-- LIMPAR DADOS EXISTENTES (OPCIONAL)
-- ================================
DELETE FROM incomes WHERE user_id = @user_id;
DELETE FROM expenses WHERE user_id = @user_id;
DELETE FROM tax_obligations WHERE user_id = @user_id;
DELETE FROM income_sources WHERE user_id = @user_id;
DELETE FROM expense_categories WHERE user_id = @user_id;

-- ================================
-- FONTES DE RECEITA
-- ================================
INSERT INTO income_sources (id, user_id, name, type, description, color, is_active, created_at, updated_at) VALUES
('source-consultoria-italo', @user_id, 'Consultoria', 'servico', 'Serviços de consultoria em TI', '#3B82F6', 1, NOW(), NOW()),
('source-vendas-italo', @user_id, 'Vendas', 'produto', 'Venda de produtos e licenças', '#10B981', 1, NOW(), NOW()),
('source-treinamentos-italo', @user_id, 'Treinamentos', 'servico', 'Cursos e treinamentos', '#F59E0B', 1, NOW(), NOW()),
('source-manutencao-italo', @user_id, 'Manutenção', 'servico', 'Manutenção de sistemas', '#8B5CF6', 1, NOW(), NOW()),
('source-desenvolvimento-italo', @user_id, 'Desenvolvimento', 'servico', 'Desenvolvimento de software', '#EF4444', 1, NOW(), NOW()),
('source-suporte-italo', @user_id, 'Suporte', 'servico', 'Suporte técnico', '#06B6D4', 1, NOW(), NOW()),
('source-hospedagem-italo', @user_id, 'Hospedagem', 'servico', 'Serviços de hospedagem', '#84CC16', 1, NOW(), NOW());

-- ================================
-- CATEGORIAS DE DESPESA
-- ================================
INSERT INTO expense_categories (id, user_id, name, color, description, is_active, created_at, updated_at) VALUES
('cat-aluguel-italo', @user_id, 'Aluguel', '#DC2626', 'Aluguel do escritório', 1, NOW(), NOW()),
('cat-utilidades-italo', @user_id, 'Utilidades', '#EA580C', 'Energia, água, etc.', 1, NOW(), NOW()),
('cat-telecom-italo', @user_id, 'Telecomunicações', '#0891B2', 'Internet, telefone', 1, NOW(), NOW()),
('cat-materiais-italo', @user_id, 'Materiais', '#7C3AED', 'Material de escritório', 1, NOW(), NOW()),
('cat-software-italo', @user_id, 'Software', '#BE185D', 'Licenças de software', 1, NOW(), NOW()),
('cat-transporte-italo', @user_id, 'Transporte', '#059669', 'Combustível, viagens', 1, NOW(), NOW()),
('cat-alimentacao-italo', @user_id, 'Alimentação', '#B45309', 'Refeições e entretenimento', 1, NOW(), NOW()),
('cat-profissionais-italo', @user_id, 'Serviços Profissionais', '#4338CA', 'Contador, advogado', 1, NOW(), NOW()),
('cat-seguros-italo', @user_id, 'Seguros', '#991B1B', 'Seguros diversos', 1, NOW(), NOW()),
('cat-marketing-italo', @user_id, 'Marketing', '#BE185D', 'Publicidade e marketing', 1, NOW(), NOW()),
('cat-tecnologia-italo', @user_id, 'Tecnologia', '#0D9488', 'Serviços de TI', 1, NOW(), NOW()),
('cat-equipamentos-italo', @user_id, 'Equipamentos', '#92400E', 'Equipamentos e hardware', 1, NOW(), NOW());

-- ================================
-- RECEITAS (usando sourceId correto)
-- ================================
INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, notes, created_at, updated_at) VALUES
('income-1-italo', @user_id, 'source-consultoria-italo', 'Consultoria de TI - Cliente A', 15000.00, '2025-01-05', 'PIX', 'Cliente A Ltda', 'Projeto de desenvolvimento de sistema', NOW(), NOW()),
('income-2-italo', @user_id, 'source-vendas-italo', 'Venda de Software - Licença Anual', 8500.00, '2025-01-10', 'Transferência', 'Software Corp', 'Licença anual do software proprietário', NOW(), NOW()),
('income-3-italo', @user_id, 'source-treinamentos-italo', 'Treinamento Corporativo', 4200.00, '2025-01-15', 'Boleto', 'Empresa Educação', 'Treinamento de React para equipe', NOW(), NOW()),
('income-4-italo', @user_id, 'source-manutencao-italo', 'Manutenção de Sistemas', 3500.00, '2025-01-20', 'PIX', 'Sistema Tech', 'Manutenção mensal de sistemas', NOW(), NOW()),
('income-5-italo', @user_id, 'source-consultoria-italo', 'Consultoria de TI - Cliente B', 12000.00, '2025-02-02', 'PIX', 'Cliente B SA', 'Migração para cloud', NOW(), NOW()),
('income-6-italo', @user_id, 'source-desenvolvimento-italo', 'Desenvolvimento de App Mobile', 18000.00, '2025-02-10', 'Transferência', 'Mobile Solutions', 'App mobile para e-commerce', NOW(), NOW()),
('income-7-italo', @user_id, 'source-suporte-italo', 'Suporte Técnico Premium', 2800.00, '2025-02-15', 'PIX', 'Support Corp', 'Suporte premium mensal', NOW(), NOW()),
('income-8-italo', @user_id, 'source-hospedagem-italo', 'Hospedagem de Sites', 1500.00, '2025-03-01', 'PIX', 'Web Hosting', 'Hospedagem de múltiplos sites', NOW(), NOW());

-- ================================
-- DESPESAS (usando category_id correto)
-- ================================
INSERT INTO expenses (id, user_id, category_id, description, amount, date, payment_method, supplier, notes, created_at, updated_at) VALUES
('expense-1-italo', @user_id, 'cat-aluguel-italo', 'Aluguel do Escritório', 2500.00, '2025-01-05', 'Transferência', 'Imobiliária Silva', 'Aluguel mensal do escritório', NOW(), NOW()),
('expense-2-italo', @user_id, 'cat-utilidades-italo', 'Energia Elétrica', 450.00, '2025-01-08', 'Debito', 'CPFL Energia', 'Conta de luz do escritório', NOW(), NOW()),
('expense-3-italo', @user_id, 'cat-telecom-italo', 'Internet e Telefone', 320.00, '2025-01-10', 'Debito', 'Vivo Empresas', 'Plano empresarial', NOW(), NOW()),
('expense-4-italo', @user_id, 'cat-materiais-italo', 'Material de Escritório', 680.00, '2025-01-12', 'PIX', 'Papelaria Central', 'Papel, canetas, cartuchos', NOW(), NOW()),
('expense-5-italo', @user_id, 'cat-software-italo', 'Software Adobe Creative Suite', 250.00, '2025-01-15', 'Cartão', 'Adobe', 'Licença mensal', NOW(), NOW()),
('expense-6-italo', @user_id, 'cat-transporte-italo', 'Combustível', 420.00, '2025-01-18', 'PIX', 'Posto Shell', 'Visitas a clientes', NOW(), NOW()),
('expense-7-italo', @user_id, 'cat-alimentacao-italo', 'Almoço com Cliente', 180.00, '2025-01-20', 'PIX', 'Restaurante Bom Sabor', 'Reunião de negócios', NOW(), NOW()),
('expense-8-italo', @user_id, 'cat-profissionais-italo', 'Contador', 800.00, '2025-01-25', 'Transferência', 'Contabilidade Silva', 'Serviços contábeis mensais', NOW(), NOW()),
('expense-9-italo', @user_id, 'cat-seguros-italo', 'Seguro Empresarial', 350.00, '2025-01-30', 'Debito', 'Porto Seguro', 'Seguro do escritório', NOW(), NOW()),
('expense-10-italo', @user_id, 'cat-marketing-italo', 'Marketing Digital', 1200.00, '2025-02-02', 'Cartão', 'Google Ads', 'Campanhas Google Ads', NOW(), NOW()),
('expense-11-italo', @user_id, 'cat-tecnologia-italo', 'Hospedagem de Servidores', 890.00, '2025-02-05', 'Cartão', 'Amazon AWS', 'AWS e serviços cloud', NOW(), NOW()),
('expense-12-italo', @user_id, 'cat-equipamentos-italo', 'Equipamentos de TI', 2100.00, '2025-02-08', 'Transferência', 'TechShop', 'Upgrade de computadores', NOW(), NOW());

-- ================================
-- OBRIGAÇÕES TRIBUTÁRIAS
-- ================================
INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, priority, frequency, reference_month, notes, tax_type, created_at, updated_at) VALUES
('tax-1-italo', @user_id, 'IRPJ - Janeiro 2025', 'Imposto de Renda Pessoa Jurídica', 'IRPJ', '2025-01-31', 2800.00, 'pago', 'alta', 'mensal', '2025-01', 'Pago via DAS', 'IRPJ', NOW(), NOW()),
('tax-2-italo', @user_id, 'CSLL - Janeiro 2025', 'Contribuição Social sobre Lucro Líquido', 'CSLL', '2025-01-31', 1400.00, 'pago', 'alta', 'mensal', '2025-01', 'Pago via DAS', 'CSLL', NOW(), NOW()),
('tax-3-italo', @user_id, 'PIS/COFINS - Janeiro 2025', 'PIS e COFINS sobre faturamento', 'PIS/COFINS', '2025-02-15', 950.00, 'pago', 'media', 'mensal', '2025-01', 'Calculado sobre receita bruta', 'PIS', NOW(), NOW()),
('tax-4-italo', @user_id, 'ISS - Janeiro 2025', 'Imposto sobre Serviços', 'ISS', '2025-02-10', 680.00, 'pago', 'media', 'mensal', '2025-01', 'ISS municipal - 2% sobre serviços', 'ISS', NOW(), NOW()),
('tax-5-italo', @user_id, 'IRPJ - Fevereiro 2025', 'Imposto de Renda Pessoa Jurídica', 'IRPJ', '2025-02-28', 3200.00, 'pendente', 'alta', 'mensal', '2025-02', 'Vencimento último dia útil', 'IRPJ', NOW(), NOW()),
('tax-6-italo', @user_id, 'CSLL - Fevereiro 2025', 'Contribuição Social sobre Lucro Líquido', 'CSLL', '2025-02-28', 1600.00, 'pendente', 'alta', 'mensal', '2025-02', 'Vencimento último dia útil', 'CSLL', NOW(), NOW()),
('tax-7-italo', @user_id, 'Simples Nacional - Março 2025', 'DAS Simples Nacional', 'Simples Nacional', '2025-03-20', 4500.00, 'pendente', 'alta', 'mensal', '2025-03', 'Anexo III - Serviços', 'Simples Nacional', NOW(), NOW()),
('tax-8-italo', @user_id, 'IRRF - Março 2025', 'Imposto de Renda Retido na Fonte', 'IRRF', '2025-03-20', 850.00, 'pendente', 'media', 'mensal', '2025-03', 'Retenção sobre serviços prestados', 'IRRF', NOW(), NOW());

-- ================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ================================
SELECT 'RESUMO DOS DADOS INSERIDOS' AS info;

SELECT 'Fontes de receita:' AS tipo, COUNT(*) AS quantidade FROM income_sources WHERE user_id = @user_id;
SELECT 'Categorias de despesa:' AS tipo, COUNT(*) AS quantidade FROM expense_categories WHERE user_id = @user_id;

SELECT 'Receitas inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM incomes WHERE user_id = @user_id;

SELECT 'Despesas inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM expenses WHERE user_id = @user_id;

SELECT 'Obrigações inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM tax_obligations WHERE user_id = @user_id;

-- Resultado líquido
SELECT 
    'RESULTADO LÍQUIDO' AS info,
    (SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = @user_id) AS receitas,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = @user_id) AS despesas,
    (SELECT COALESCE(SUM(amount), 0) FROM tax_obligations WHERE user_id = @user_id) AS obrigacoes,
    (
        (SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = @user_id) - 
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = @user_id) - 
        (SELECT COALESCE(SUM(amount), 0) FROM tax_obligations WHERE user_id = @user_id)
    ) AS resultado_liquido;
