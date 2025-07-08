-- Limpar obrigações existentes para o usuário teste
DELETE FROM tax_obligations WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';

-- Inserir obrigações tributárias de teste
INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, frequency, reference_month, notes, tax_type) VALUES
('tax-1-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'IRPJ - Janeiro', 'Imposto de Renda Pessoa Jurídica', 'IRPJ', '2025-01-31', 2500.00, 'pendente', 'mensal', '2025-01', 'Vencimento último dia útil do mês', 'IRPJ'),
('tax-2-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'CSLL - Janeiro', 'Contribuição Social sobre Lucro Líquido', 'CSLL', '2025-01-31', 1200.00, 'pendente', 'mensal', '2025-01', 'Vencimento último dia útil do mês', 'CSLL'),
('tax-3-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'PIS/COFINS - Janeiro', 'PIS e COFINS sobre faturamento', 'PIS/COFINS', '2025-02-15', 850.00, 'pendente', 'mensal', '2025-01', 'Vencimento até o dia 15 do mês seguinte', 'PIS'),
('tax-4-teste-2025', 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d', 'ISS - Janeiro', 'Imposto sobre Serviços', 'ISS', '2025-02-10', 450.00, 'pago', 'mensal', '2025-01', 'Pago antecipadamente', 'ISS');

-- Verificar dados inseridos
SELECT 'Obrigações tributárias inseridas:' as info, COUNT(*) as count FROM tax_obligations WHERE user_id = 'be4b6e03-47aa-4c7f-912f-8dd684f9bf9d';
