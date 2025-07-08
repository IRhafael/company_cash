-- Script para popular dados de teste para o usuário "italo" (devrhafael@outlook.com)
-- User ID: f6a40734-335e-49f4-a9c7-e15f5305c7a6

USE company;

-- ============================================================================
-- RECEITAS PARA O USUÁRIO ITALO
-- ============================================================================

-- Receitas de Janeiro 2024
INSERT INTO incomes (id, user_id, income_source_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'a57f4581-0c2b-4180-b4ee-af18933bd75d', 15000.00, 'Honorários contábeis - Cliente ABC Ltda', '2024-01-15', 'pix', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '42b927b0-5274-4dbe-a4f2-4c958b65d9c6', 8500.00, 'Consultoria tributária - Empresa XYZ', '2024-01-20', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '4b610c9e-6a07-44d9-9bca-edc147448307', 3200.00, 'Serviços diversos - Pessoa física', '2024-01-25', 'dinheiro', NOW(), NOW());

-- Receitas de Fevereiro 2024
INSERT INTO incomes (id, user_id, income_source_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'a57f4581-0c2b-4180-b4ee-af18933bd75d', 18000.00, 'Honorários contábeis - Cliente DEF Ltda', '2024-02-10', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '42b927b0-5274-4dbe-a4f2-4c958b65d9c6', 12000.00, 'Consultoria fiscal - Recuperação de créditos', '2024-02-18', 'pix', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '4b610c9e-6a07-44d9-9bca-edc147448307', 4500.00, 'Elaboração de demonstrativos', '2024-02-28', 'cheque', NOW(), NOW());

-- Receitas de Março 2024
INSERT INTO incomes (id, user_id, income_source_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'a57f4581-0c2b-4180-b4ee-af18933bd75d', 22000.00, 'Honorários contábeis - Múltiplos clientes', '2024-03-15', 'pix', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '42b927b0-5274-4dbe-a4f2-4c958b65d9c6', 9500.00, 'Consultoria tributária - Planejamento fiscal', '2024-03-22', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '4b610c9e-6a07-44d9-9bca-edc147448307', 6000.00, 'Serviços de auditoria interna', '2024-03-30', 'pix', NOW(), NOW());

-- ============================================================================
-- DESPESAS PARA O USUÁRIO ITALO
-- ============================================================================

-- Despesas de Janeiro 2024
INSERT INTO expenses (id, user_id, category_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'fd954959-86ae-43ff-bcb8-a66c119cd386', 3500.00, 'Aluguel do escritório - Janeiro', '2024-01-05', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '20d23fd2-50c1-4c01-8054-ffa70681160a', 8500.00, 'Salários e encargos - Janeiro', '2024-01-30', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 1200.00, 'Material de escritório e suprimentos', '2024-01-12', 'cartao_credito', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 450.00, 'Conta de telefone e internet', '2024-01-18', 'debito_automatico', NOW(), NOW());

-- Despesas de Fevereiro 2024
INSERT INTO expenses (id, user_id, category_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'fd954959-86ae-43ff-bcb8-a66c119cd386', 3500.00, 'Aluguel do escritório - Fevereiro', '2024-02-05', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '20d23fd2-50c1-4c01-8054-ffa70681160a', 9200.00, 'Salários e encargos - Fevereiro', '2024-02-28', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 800.00, 'Combustível e deslocamentos', '2024-02-15', 'cartao_credito', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 650.00, 'Softwares e licenças', '2024-02-20', 'cartao_credito', NOW(), NOW());

-- Despesas de Março 2024
INSERT INTO expenses (id, user_id, category_id, amount, description, date, payment_method, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'fd954959-86ae-43ff-bcb8-a66c119cd386', 3500.00, 'Aluguel do escritório - Março', '2024-03-05', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', '20d23fd2-50c1-4c01-8054-ffa70681160a', 9800.00, 'Salários e encargos - Março', '2024-03-30', 'transferencia', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 1500.00, 'Equipamentos de informática', '2024-03-10', 'cartao_credito', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'c992fd22-8cb2-439a-96c1-8c10d52cba5c', 750.00, 'Cursos e treinamentos', '2024-03-25', 'pix', NOW(), NOW());

-- ============================================================================
-- OBRIGAÇÕES TRIBUTÁRIAS PARA O USUÁRIO ITALO
-- ============================================================================

-- Obrigações de Janeiro 2024
INSERT INTO tax_obligations (id, user_id, name, type, description, due_date, amount, status, tax_type, period_start, period_end, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DAS MEI Janeiro/2024', 'federal', 'Documento de Arrecadação do Simples Nacional - MEI', '2024-02-20', 68.00, 'paid', 'simples_nacional', '2024-01-01', '2024-01-31', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'ISS Janeiro/2024', 'municipal', 'Imposto Sobre Serviços de Qualquer Natureza', '2024-02-15', 890.00, 'paid', 'iss', '2024-01-01', '2024-01-31', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'IRPF 2024', 'federal', 'Imposto de Renda Pessoa Física - Exercício 2024', '2024-04-30', 0.00, 'pending', 'irpf', '2024-01-01', '2024-12-31', NOW(), NOW());

-- Obrigações de Fevereiro 2024
INSERT INTO tax_obligations (id, user_id, name, type, description, due_date, amount, status, tax_type, period_start, period_end, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DAS MEI Fevereiro/2024', 'federal', 'Documento de Arrecadação do Simples Nacional - MEI', '2024-03-20', 68.00, 'paid', 'simples_nacional', '2024-02-01', '2024-02-29', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'ISS Fevereiro/2024', 'municipal', 'Imposto Sobre Serviços de Qualquer Natureza', '2024-03-15', 1150.00, 'paid', 'iss', '2024-02-01', '2024-02-29', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DEFIS 2023', 'federal', 'Declaração de Informações Socioeconômicas e Fiscais', '2024-03-31', 0.00, 'overdue', 'defis', '2023-01-01', '2023-12-31', NOW(), NOW());

-- Obrigações de Março 2024
INSERT INTO tax_obligations (id, user_id, name, type, description, due_date, amount, status, tax_type, period_start, period_end, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DAS MEI Março/2024', 'federal', 'Documento de Arrecadação do Simples Nacional - MEI', '2024-04-22', 68.00, 'pending', 'simples_nacional', '2024-03-01', '2024-03-31', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'ISS Março/2024', 'municipal', 'Imposto Sobre Serviços de Qualquer Natureza', '2024-04-15', 1320.00, 'pending', 'iss', '2024-03-01', '2024-03-31', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'PGDAS-D 1º Trimestre/2024', 'federal', 'Programa Gerador do DAS Declaratório', '2024-05-31', 0.00, 'pending', 'simples_nacional', '2024-01-01', '2024-03-31', NOW(), NOW());

-- Obrigações futuras (para demonstrar o sistema)
INSERT INTO tax_obligations (id, user_id, name, type, description, due_date, amount, status, tax_type, period_start, period_end, created_at, updated_at) VALUES
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DAS MEI Abril/2024', 'federal', 'Documento de Arrecadação do Simples Nacional - MEI', '2024-05-20', 68.00, 'pending', 'simples_nacional', '2024-04-01', '2024-04-30', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'ISS Abril/2024', 'municipal', 'Imposto Sobre Serviços de Qualquer Natureza', '2024-05-15', 1200.00, 'pending', 'iss', '2024-04-01', '2024-04-30', NOW(), NOW()),
(UUID(), 'f6a40734-335e-49f4-a9c7-e15f5305c7a6', 'DASN-SIMEI 2023', 'federal', 'Declaração Anual do Simples Nacional - MEI', '2024-05-31', 0.00, 'pending', 'simples_nacional', '2023-01-01', '2023-12-31', NOW(), NOW());

-- ============================================================================
-- VERIFICAÇÕES
-- ============================================================================

-- Verificar dados inseridos
SELECT 'RECEITAS INSERIDAS' as tipo, COUNT(*) as quantidade FROM incomes WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6'
UNION ALL
SELECT 'DESPESAS INSERIDAS' as tipo, COUNT(*) as quantidade FROM expenses WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6'
UNION ALL
SELECT 'OBRIGAÇÕES INSERIDAS' as tipo, COUNT(*) as quantidade FROM tax_obligations WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6';

-- Resumo financeiro
SELECT 
    'RESUMO FINANCEIRO' as titulo,
    COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) as total_receitas,
    COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) as total_despesas,
    COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) as saldo
FROM (
    SELECT 'receita' as tipo, amount as valor FROM incomes WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6'
    UNION ALL
    SELECT 'despesa' as tipo, amount as valor FROM expenses WHERE user_id = 'f6a40734-335e-49f4-a9c7-e15f5305c7a6'
) as financeiro;
