-- Limpar dados existentes para o usuário teste
DELETE FROM incomes WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';
DELETE FROM income_sources WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';

-- Criar fontes de receita para o usuário teste
INSERT INTO income_sources (id, user_id, name, type, description, color, is_active, created_at) VALUES 
('src-honorarios-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Honorários Contábeis', 'servico', 'Serviços de contabilidade', '#22c55e', 1, NOW()),
('src-consultoria-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Consultoria', 'servico', 'Consultoria empresarial', '#3b82f6', 1, NOW()),
('src-auditoria-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Auditoria', 'servico', 'Serviços de auditoria', '#8b5cf6', 1, NOW()),
('src-cursos-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Cursos', 'produto', 'Cursos e treinamentos', '#f59e0b', 1, NOW());

-- Criar algumas receitas de exemplo
INSERT INTO incomes (id, user_id, source_id, description, amount, date, type, status, payment_method, client_name, invoice_number, notes, created_at) VALUES 
('inc-1-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'src-honorarios-teste-2025', 'Honorários contábeis Janeiro - Empresa ABC', 5000.00, '2025-01-10', 'recorrente', 'confirmado', 'PIX', 'Empresa ABC Ltda', 'FAT-001', 'Honorários mensais de contabilidade', NOW()),
('inc-2-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'src-consultoria-teste-2025', 'Consultoria estratégica - XYZ Corp', 3000.00, '2025-01-15', 'unico', 'confirmado', 'Transferência', 'XYZ Corp', 'FAT-002', 'Projeto de consultoria estratégica', NOW()),
('inc-3-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'src-auditoria-teste-2025', 'Auditoria contábil - DEF Cia', 8000.00, '2025-01-20', 'unico', 'pendente', 'Boleto', 'DEF Cia', 'FAT-003', 'Auditoria completa do exercício 2024', NOW()),
('inc-4-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'src-cursos-teste-2025', 'Curso de Gestão Financeira', 1500.00, '2025-01-25', 'unico', 'confirmado', 'Cartão', 'João Silva', 'FAT-004', 'Curso online de gestão financeira', NOW());

-- Verificar se os dados foram inseridos
SELECT 'Fontes de receita inseridas:' as info, COUNT(*) as count FROM income_sources WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d'
UNION ALL  
SELECT 'Receitas inseridas:', COUNT(*) FROM incomes WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';
