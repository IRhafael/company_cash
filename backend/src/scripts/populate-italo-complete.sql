-- Script SQL para inserir dados completos para o usuário italo
-- Execute este script diretamente no MySQL

-- ID do usuário italo: f6a40734-335e-49f4-a9c7-e15f5305c7a6

-- ================================
-- RECEITAS
-- ================================

INSERT INTO incomes (id, user_id, description, amount, date, source, category, notes, created_at, updated_at) VALUES
('income-1-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Consultoria de TI - Cliente A', 15000.00, '2025-01-05', 'Consultoria', 'Serviços', 'Projeto de desenvolvimento de sistema', NOW(), NOW()),
('income-2-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Venda de Software - Licença Anual', 8500.00, '2025-01-10', 'Vendas', 'Produtos', 'Licença anual do software proprietário', NOW(), NOW()),
('income-3-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Treinamento Corporativo', 4200.00, '2025-01-15', 'Treinamentos', 'Educação', 'Treinamento de React para equipe', NOW(), NOW()),
('income-4-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Manutenção de Sistemas', 3500.00, '2025-01-20', 'Manutenção', 'Serviços', 'Manutenção mensal de sistemas', NOW(), NOW()),
('income-5-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Consultoria de TI - Cliente B', 12000.00, '2025-02-02', 'Consultoria', 'Serviços', 'Migração para cloud', NOW(), NOW()),
('income-6-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Desenvolvimento de App Mobile', 18000.00, '2025-02-10', 'Desenvolvimento', 'Projetos', 'App mobile para e-commerce', NOW(), NOW()),
('income-7-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Suporte Técnico Premium', 2800.00, '2025-02-15', 'Suporte', 'Serviços', 'Suporte premium mensal', NOW(), NOW()),
('income-8-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Hospedagem de Sites', 1500.00, '2025-03-01', 'Hospedagem', 'Serviços', 'Hospedagem de múltiplos sites', NOW(), NOW());

-- ================================
-- DESPESAS
-- ================================

INSERT INTO expenses (id, user_id, description, amount, date, category, notes, created_at, updated_at) VALUES
('expense-1-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Aluguel do Escritório', 2500.00, '2025-01-05', 'Aluguel', 'Aluguel mensal do escritório', NOW(), NOW()),
('expense-2-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Energia Elétrica', 450.00, '2025-01-08', 'Utilidades', 'Conta de luz do escritório', NOW(), NOW()),
('expense-3-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Internet e Telefone', 320.00, '2025-01-10', 'Telecomunicações', 'Plano empresarial', NOW(), NOW()),
('expense-4-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Material de Escritório', 680.00, '2025-01-12', 'Materiais', 'Papel, canetas, cartuchos', NOW(), NOW()),
('expense-5-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Software Adobe Creative Suite', 250.00, '2025-01-15', 'Software', 'Licença mensal', NOW(), NOW()),
('expense-6-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Combustível', 420.00, '2025-01-18', 'Transporte', 'Visitas a clientes', NOW(), NOW()),
('expense-7-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Almoço com Cliente', 180.00, '2025-01-20', 'Alimentação', 'Reunião de negócios', NOW(), NOW()),
('expense-8-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Contador', 800.00, '2025-01-25', 'Serviços Profissionais', 'Serviços contábeis mensais', NOW(), NOW()),
('expense-9-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Seguro Empresarial', 350.00, '2025-01-30', 'Seguros', 'Seguro do escritório', NOW(), NOW()),
('expense-10-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Marketing Digital', 1200.00, '2025-02-02', 'Marketing', 'Campanhas Google Ads', NOW(), NOW()),
('expense-11-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Hospedagem de Servidores', 890.00, '2025-02-05', 'Tecnologia', 'AWS e serviços cloud', NOW(), NOW()),
('expense-12-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Equipamentos de TI', 2100.00, '2025-02-08', 'Equipamentos', 'Upgrade de computadores', NOW(), NOW());

-- ================================
-- OBRIGAÇÕES TRIBUTÁRIAS
-- ================================

INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, priority, frequency, reference_month, notes, tax_type, created_at, updated_at) VALUES
('tax-1-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'IRPJ - Janeiro 2025', 'Imposto de Renda Pessoa Jurídica', 'IRPJ', '2025-01-31', 2800.00, 'pago', 'alta', 'mensal', '2025-01', 'Pago via DAS', 'IRPJ', NOW(), NOW()),
('tax-2-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'CSLL - Janeiro 2025', 'Contribuição Social sobre Lucro Líquido', 'CSLL', '2025-01-31', 1400.00, 'pago', 'alta', 'mensal', '2025-01', 'Pago via DAS', 'CSLL', NOW(), NOW()),
('tax-3-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'PIS/COFINS - Janeiro 2025', 'PIS e COFINS sobre faturamento', 'PIS/COFINS', '2025-02-15', 950.00, 'pago', 'media', 'mensal', '2025-01', 'Calculado sobre receita bruta', 'PIS', NOW(), NOW()),
('tax-4-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'ISS - Janeiro 2025', 'Imposto sobre Serviços', 'ISS', '2025-02-10', 680.00, 'pago', 'media', 'mensal', '2025-01', 'ISS municipal - 2% sobre serviços', 'ISS', NOW(), NOW()),
('tax-5-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'IRPJ - Fevereiro 2025', 'Imposto de Renda Pessoa Jurídica', 'IRPJ', '2025-02-28', 3200.00, 'pendente', 'alta', 'mensal', '2025-02', 'Vencimento último dia útil', 'IRPJ', NOW(), NOW()),
('tax-6-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'CSLL - Fevereiro 2025', 'Contribuição Social sobre Lucro Líquido', 'CSLL', '2025-02-28', 1600.00, 'pendente', 'alta', 'mensal', '2025-02', 'Vencimento último dia útil', 'CSLL', NOW(), NOW()),
('tax-7-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'Simples Nacional - Março 2025', 'DAS Simples Nacional', 'Simples Nacional', '2025-03-20', 4500.00, 'pendente', 'alta', 'mensal', '2025-03', 'Anexo III - Serviços', 'Simples Nacional', NOW(), NOW()),
('tax-8-italo', 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'IRRF - Março 2025', 'Imposto de Renda Retido na Fonte', 'IRRF', '2025-03-20', 850.00, 'pendente', 'media', 'mensal', '2025-03', 'Retenção sobre serviços prestados', 'IRRF', NOW(), NOW());

-- ================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ================================

SELECT 'RESUMO DOS DADOS INSERIDOS' AS info;

SELECT 'Receitas inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM incomes WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6';

SELECT 'Despesas inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM expenses WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6';

SELECT 'Obrigações inseridas:' AS tipo, COUNT(*) AS quantidade, SUM(amount) AS total
FROM tax_obligations WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6';

-- Resultado líquido
SELECT 
    'RESULTADO LÍQUIDO' AS info,
    (SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6') AS receitas,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6') AS despesas,
    (SELECT COALESCE(SUM(amount), 0) FROM tax_obligations WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6') AS obrigacoes,
    (
        (SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6') - 
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6') - 
        (SELECT COALESCE(SUM(amount), 0) FROM tax_obligations WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6')
    ) AS resultado_liquido;
