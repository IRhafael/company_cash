-- Limpar dados padrão existentes
DELETE FROM income_sources WHERE user_id = 'user-demo-123';
DELETE FROM expense_categories WHERE user_id = 'user-demo-123';

-- Inserir fontes de receita padrão
INSERT INTO income_sources (id, user_id, name, type, color, account_code, is_active, created_at, updated_at) VALUES
(UUID(), 'user-demo-123', 'Honorários Contábeis', 'servico', '#22c55e', '3.1.01', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Consultoria Empresarial', 'servico', '#3b82f6', '3.1.02', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Auditoria', 'servico', '#8b5cf6', '3.1.03', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Abertura de Empresas', 'servico', '#f59e0b', '3.1.04', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Consultoria Tributária', 'servico', '#ef4444', '3.1.05', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Perícia Contábil', 'servico', '#06b6d4', '3.1.06', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Assessoria Fiscal', 'servico', '#84cc16', '3.1.07', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Cursos e Treinamentos', 'produto', '#f97316', '3.1.08', 1, NOW(), NOW());

-- Inserir categorias de despesa padrão
INSERT INTO expense_categories (id, user_id, name, color, account_code, is_active, created_at, updated_at) VALUES
(UUID(), 'user-demo-123', 'Aluguel', '#dc2626', '4.1.01', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Salários', '#059669', '4.1.02', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Material de Escritório', '#0891b2', '4.1.03', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Software e Licenças', '#7c3aed', '4.1.04', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Energia Elétrica', '#ea580c', '4.1.05', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Telefone/Internet', '#0d9488', '4.1.06', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Marketing', '#be185d', '4.1.07', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Contabilidade', '#4338ca', '4.1.08', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Impostos', '#991b1b', '4.1.09', 1, NOW(), NOW()),
(UUID(), 'user-demo-123', 'Viagens', '#92400e', '4.1.10', 1, NOW(), NOW());

-- Verificar dados inseridos
SELECT 'Fontes de receita inseridas:' as info, COUNT(*) as count FROM income_sources WHERE user_id = 'user-demo-123'
UNION ALL
SELECT 'Categorias de despesa inseridas:' as info, COUNT(*) as count FROM expense_categories WHERE user_id = 'user-demo-123';
