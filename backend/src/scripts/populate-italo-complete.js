const mysql = require('mysql2/promise');

async function populateItaloData() {
  console.log('🔧 Populando dados completos para usuário Italo...');
  
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company',
  });
  
  try {
    const userId = 'user-italo-1751997790402';
    
    // 1. Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await db.query('DELETE FROM incomes WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM expenses WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM tax_obligations WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM income_sources WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM expense_categories WHERE user_id = ?', [userId]);
    
    // 2. Criar fontes de receita
    console.log('📊 Criando fontes de receita...');
    const incomeSources = [
      { id: 'source-consultoria-italo', name: 'Consultoria', type: 'servico', description: 'Serviços de consultoria em TI', color: '#3B82F6' },
      { id: 'source-vendas-italo', name: 'Vendas', type: 'produto', description: 'Venda de produtos e licenças', color: '#10B981' },
      { id: 'source-treinamentos-italo', name: 'Treinamentos', type: 'servico', description: 'Cursos e treinamentos', color: '#F59E0B' },
      { id: 'source-manutencao-italo', name: 'Manutenção', type: 'servico', description: 'Manutenção de sistemas', color: '#8B5CF6' },
      { id: 'source-desenvolvimento-italo', name: 'Desenvolvimento', type: 'servico', description: 'Desenvolvimento de software', color: '#EF4444' },
      { id: 'source-suporte-italo', name: 'Suporte', type: 'servico', description: 'Suporte técnico', color: '#06B6D4' },
      { id: 'source-hospedagem-italo', name: 'Hospedagem', type: 'servico', description: 'Serviços de hospedagem', color: '#84CC16' }
    ];
    
    for (const source of incomeSources) {
      await db.query(
        'INSERT INTO income_sources (id, user_id, name, type, description, color, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [source.id, userId, source.name, source.type, source.description, source.color, 1]
      );
      console.log(`  ✅ ${source.name}`);
    }
    
    // 3. Criar categorias de despesa
    console.log('💸 Criando categorias de despesa...');
    const expenseCategories = [
      { id: 'cat-aluguel-italo', name: 'Aluguel', color: '#DC2626', description: 'Aluguel do escritório' },
      { id: 'cat-utilidades-italo', name: 'Utilidades', color: '#EA580C', description: 'Energia, água, etc.' },
      { id: 'cat-telecom-italo', name: 'Telecomunicações', color: '#0891B2', description: 'Internet, telefone' },
      { id: 'cat-materiais-italo', name: 'Materiais', color: '#7C3AED', description: 'Material de escritório' },
      { id: 'cat-software-italo', name: 'Software', color: '#BE185D', description: 'Licenças de software' },
      { id: 'cat-transporte-italo', name: 'Transporte', color: '#059669', description: 'Combustível, viagens' },
      { id: 'cat-alimentacao-italo', name: 'Alimentação', color: '#B45309', description: 'Refeições e entretenimento' },
      { id: 'cat-profissionais-italo', name: 'Serviços Profissionais', color: '#4338CA', description: 'Contador, advogado' },
      { id: 'cat-seguros-italo', name: 'Seguros', color: '#991B1B', description: 'Seguros diversos' },
      { id: 'cat-marketing-italo', name: 'Marketing', color: '#BE185D', description: 'Publicidade e marketing' },
      { id: 'cat-tecnologia-italo', name: 'Tecnologia', color: '#0D9488', description: 'Serviços de TI' },
      { id: 'cat-equipamentos-italo', name: 'Equipamentos', color: '#92400E', description: 'Equipamentos e hardware' }
    ];
    
    for (const category of expenseCategories) {
      await db.query(
        'INSERT INTO expense_categories (id, user_id, name, color, description, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [category.id, userId, category.name, category.color, category.description, 1]
      );
      console.log(`  ✅ ${category.name}`);
    }
    
    // 4. Inserir receitas
    console.log('💰 Inserindo receitas...');
    const incomes = [
      { id: 'income-1-italo', sourceId: 'source-consultoria-italo', description: 'Consultoria de TI - Cliente A', amount: 15000.00, date: '2025-01-05', client: 'Cliente A Ltda' },
      { id: 'income-2-italo', sourceId: 'source-vendas-italo', description: 'Venda de Software - Licença Anual', amount: 8500.00, date: '2025-01-10', client: 'Software Corp' },
      { id: 'income-3-italo', sourceId: 'source-treinamentos-italo', description: 'Treinamento Corporativo', amount: 4200.00, date: '2025-01-15', client: 'Empresa Educação' },
      { id: 'income-4-italo', sourceId: 'source-manutencao-italo', description: 'Manutenção de Sistemas', amount: 3500.00, date: '2025-01-20', client: 'Sistema Tech' },
      { id: 'income-5-italo', sourceId: 'source-consultoria-italo', description: 'Consultoria de TI - Cliente B', amount: 12000.00, date: '2025-02-02', client: 'Cliente B SA' },
      { id: 'income-6-italo', sourceId: 'source-desenvolvimento-italo', description: 'Desenvolvimento de App Mobile', amount: 18000.00, date: '2025-02-10', client: 'Mobile Solutions' },
      { id: 'income-7-italo', sourceId: 'source-suporte-italo', description: 'Suporte Técnico Premium', amount: 2800.00, date: '2025-02-15', client: 'Support Corp' },
      { id: 'income-8-italo', sourceId: 'source-hospedagem-italo', description: 'Hospedagem de Sites', amount: 1500.00, date: '2025-03-01', client: 'Web Hosting' }
    ];
    
    for (const income of incomes) {
      await db.query(
        'INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [income.id, userId, income.sourceId, income.description, income.amount, income.date, 'PIX', income.client, 'Receita de exemplo']
      );
      console.log(`  ✅ ${income.description} - R$ ${income.amount}`);
    }
    
    // 5. Inserir despesas
    console.log('💸 Inserindo despesas...');
    const expenses = [
      { id: 'expense-1-italo', categoryId: 'cat-aluguel-italo', description: 'Aluguel do Escritório', amount: 2500.00, date: '2025-01-05', supplier: 'Imobiliária Silva' },
      { id: 'expense-2-italo', categoryId: 'cat-utilidades-italo', description: 'Energia Elétrica', amount: 450.00, date: '2025-01-08', supplier: 'CPFL Energia' },
      { id: 'expense-3-italo', categoryId: 'cat-telecom-italo', description: 'Internet e Telefone', amount: 320.00, date: '2025-01-10', supplier: 'Vivo Empresas' },
      { id: 'expense-4-italo', categoryId: 'cat-materiais-italo', description: 'Material de Escritório', amount: 680.00, date: '2025-01-12', supplier: 'Papelaria Central' },
      { id: 'expense-5-italo', categoryId: 'cat-software-italo', description: 'Software Adobe Creative Suite', amount: 250.00, date: '2025-01-15', supplier: 'Adobe' },
      { id: 'expense-6-italo', categoryId: 'cat-transporte-italo', description: 'Combustível', amount: 420.00, date: '2025-01-18', supplier: 'Posto Shell' },
      { id: 'expense-7-italo', categoryId: 'cat-alimentacao-italo', description: 'Almoço com Cliente', amount: 180.00, date: '2025-01-20', supplier: 'Restaurante Bom Sabor' },
      { id: 'expense-8-italo', categoryId: 'cat-profissionais-italo', description: 'Contador', amount: 800.00, date: '2025-01-25', supplier: 'Contabilidade Silva' },
      { id: 'expense-9-italo', categoryId: 'cat-seguros-italo', description: 'Seguro Empresarial', amount: 350.00, date: '2025-01-30', supplier: 'Porto Seguro' },
      { id: 'expense-10-italo', categoryId: 'cat-marketing-italo', description: 'Marketing Digital', amount: 1200.00, date: '2025-02-02', supplier: 'Google Ads' },
      { id: 'expense-11-italo', categoryId: 'cat-tecnologia-italo', description: 'Hospedagem de Servidores', amount: 890.00, date: '2025-02-05', supplier: 'Amazon AWS' },
      { id: 'expense-12-italo', categoryId: 'cat-equipamentos-italo', description: 'Equipamentos de TI', amount: 2100.00, date: '2025-02-08', supplier: 'TechShop' }
    ];
    
    for (const expense of expenses) {
      await db.query(
        'INSERT INTO expenses (id, user_id, category_id, description, amount, date, payment_method, supplier, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [expense.id, userId, expense.categoryId, expense.description, expense.amount, expense.date, 'PIX', expense.supplier, 'Despesa de exemplo']
      );
      console.log(`  ✅ ${expense.description} - R$ ${expense.amount}`);
    }
    
    // 6. Inserir obrigações tributárias
    console.log('📋 Inserindo obrigações tributárias...');
    const obligations = [
      { id: 'tax-1-italo', name: 'IRPJ - Janeiro 2025', type: 'IRPJ', amount: 2800.00, dueDate: '2025-01-31', status: 'pago' },
      { id: 'tax-2-italo', name: 'CSLL - Janeiro 2025', type: 'CSLL', amount: 1400.00, dueDate: '2025-01-31', status: 'pago' },
      { id: 'tax-3-italo', name: 'PIS/COFINS - Janeiro 2025', type: 'PIS/COFINS', amount: 950.00, dueDate: '2025-02-15', status: 'pago' },
      { id: 'tax-4-italo', name: 'ISS - Janeiro 2025', type: 'ISS', amount: 680.00, dueDate: '2025-02-10', status: 'pago' },
      { id: 'tax-5-italo', name: 'IRPJ - Fevereiro 2025', type: 'IRPJ', amount: 3200.00, dueDate: '2025-02-28', status: 'pendente' },
      { id: 'tax-6-italo', name: 'CSLL - Fevereiro 2025', type: 'CSLL', amount: 1600.00, dueDate: '2025-02-28', status: 'pendente' },
      { id: 'tax-7-italo', name: 'Simples Nacional - Março 2025', type: 'Simples Nacional', amount: 4500.00, dueDate: '2025-03-20', status: 'pendente' },
      { id: 'tax-8-italo', name: 'IRRF - Março 2025', type: 'IRRF', amount: 850.00, dueDate: '2025-03-20', status: 'pendente' }
    ];
    
    for (const obligation of obligations) {
      await db.query(
        'INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, frequency, reference_month, notes, tax_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [obligation.id, userId, obligation.name, `${obligation.type} referente ao período`, obligation.type, obligation.dueDate, obligation.amount, obligation.status, 'mensal', '2025-01', 'Obrigação de exemplo', obligation.type]
      );
      console.log(`  ✅ ${obligation.name} - R$ ${obligation.amount} (${obligation.status})`);
    }
    
    // 7. Verificação final
    console.log('\n📊 Resumo dos dados inseridos:');
    const [sourceCount] = await db.query('SELECT COUNT(*) as count FROM income_sources WHERE user_id = ?', [userId]);
    const [categoryCount] = await db.query('SELECT COUNT(*) as count FROM expense_categories WHERE user_id = ?', [userId]);
    const [incomeCount] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM incomes WHERE user_id = ?', [userId]);
    const [expenseCount] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE user_id = ?', [userId]);
    const [obligationCount] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM tax_obligations WHERE user_id = ?', [userId]);
    
    console.log(`📊 Fontes de receita: ${sourceCount[0].count}`);
    console.log(`📊 Categorias de despesa: ${categoryCount[0].count}`);
    console.log(`💰 Receitas: ${incomeCount[0].count} itens - R$ ${incomeCount[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    console.log(`💸 Despesas: ${expenseCount[0].count} itens - R$ ${expenseCount[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    console.log(`📋 Obrigações: ${obligationCount[0].count} itens - R$ ${obligationCount[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    
    const result = (incomeCount[0].total || 0) - (expenseCount[0].total || 0) - (obligationCount[0].total || 0);
    console.log(`🎯 Resultado Líquido: R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    console.log('\n✅ Dados inseridos com sucesso!');
    console.log('🌐 Acesse http://localhost:5173 e faça login para visualizar os gráficos!');
    console.log('   Email: devrhafael@outlook.com');
    console.log('   Senha: Viver321');
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message);
  } finally {
    await db.end();
  }
}

populateItaloData();
