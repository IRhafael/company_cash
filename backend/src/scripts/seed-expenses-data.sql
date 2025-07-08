-- Limpar dados existentes para o usuário teste
DELETE FROM expenses WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';
DELETE FROM expense_categories WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';

-- Criar categorias de despesas para o usuário teste
INSERT INTO expense_categories (id, user_id, name, description, color, is_active, created_at) VALUES 
('cat-aluguel-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Aluguel', 'Aluguel do escritório', '#DC2626', 1, NOW()),
('cat-funcionarios-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Funcionários', 'Salários e encargos', '#7C3AED', 1, NOW()),
('cat-marketing-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Marketing', 'Despesas de marketing e publicidade', '#F59E0B', 1, NOW()),
('cat-operacional-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'Operacional', 'Despesas operacionais gerais', '#059669', 1, NOW());

-- Criar algumas despesas de exemplo
INSERT INTO expenses (id, user_id, category_id, description, amount, date, type, status, payment_method, supplier, invoice_number, notes, created_at) VALUES 
('exp-1-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'cat-aluguel-teste-2025', 'Aluguel escritório janeiro', 2500.00, '2025-01-05', 'fixa', 'pago', 'Transferência', 'Imobiliária XYZ', 'ALG-001', 'Aluguel mensal do escritório', NOW()),
('exp-2-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'cat-funcionarios-teste-2025', 'Salários janeiro', 8000.00, '2025-01-15', 'fixa', 'pago', 'PIX', 'Folha de Pagamento', 'SAL-001', 'Pagamento de salários', NOW()),
('exp-3-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'cat-marketing-teste-2025', 'Campanha Google Ads', 1200.00, '2025-01-20', 'variavel', 'pago', 'Cartão', 'Google Brasil', 'GG-001', 'Campanha de marketing digital', NOW()),
('exp-4-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'cat-operacional-teste-2025', 'Material de escritório', 350.00, '2025-01-25', 'variavel', 'pendente', 'Boleto', 'Papelaria ABC', 'MAT-001', 'Compra de material de escritório', NOW());

-- Verificar se os dados foram inseridos
SELECT 'Categorias de despesas inseridas:' as info, COUNT(*) as count FROM expense_categories WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d'
UNION ALL  
SELECT 'Despesas inseridas:', COUNT(*) FROM expenses WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';
