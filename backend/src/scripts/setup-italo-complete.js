const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function setupItaloData() {
  console.log('🔧 Configurando dados para usuário Italo...');
  
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company',
  });
  
  try {
    const userId = 'user-italo-1751997790402';
    
    // Limpar dados existentes
    console.log('Limpando dados existentes...');
    await db.query('DELETE FROM tax_obligations WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM incomes WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM expenses WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM income_sources WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM expense_categories WHERE user_id = ?', [userId]);
    
    // 1. Criar fontes de receita
    console.log('\n📊 Criando fontes de receita...');
    const incomeSources = [
      { name: 'Honorários Contábeis', type: 'servico', color: '#22c55e', description: 'Serviços de contabilidade regular' },
      { name: 'Consultoria Empresarial', type: 'servico', color: '#3b82f6', description: 'Consultoria estratégica para empresas' },
      { name: 'Abertura de Empresas', type: 'servico', color: '#f59e0b', description: 'Serviços de abertura e legalização' },
      { name: 'Auditoria', type: 'servico', color: '#8b5cf6', description: 'Serviços de auditoria contábil' },
      { name: 'Declaração IR', type: 'servico', color: '#ef4444', description: 'Elaboração de declarações de IR' }
    ];
    
    for (const source of incomeSources) {
      const id = uuidv4();
      await db.query(
        'INSERT INTO income_sources (id, user_id, name, type, description, color, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [id, userId, source.name, source.type, source.description, source.color, 1]
      );
      console.log(`✅ Fonte criada: ${source.name}`);
    }
    
    // 2. Criar categorias de despesa
    console.log('\n💸 Criando categorias de despesa...');
    const expenseCategories = [
      { name: 'Aluguel', color: '#dc2626', description: 'Aluguel do escritório' },
      { name: 'Salários', color: '#059669', description: 'Folha de pagamento' },
      { name: 'Material de Escritório', color: '#0891b2', description: 'Materiais e suprimentos' },
      { name: 'Software e Licenças', color: '#7c3aed', description: 'Softwares e sistemas' },
      { name: 'Energia Elétrica', color: '#ea580c', description: 'Conta de luz' },
      { name: 'Telefone/Internet', color: '#0d9488', description: 'Telecomunicações' },
      { name: 'Marketing', color: '#be185d', description: 'Publicidade e marketing' },
      { name: 'Impostos', color: '#991b1b', description: 'Tributos e impostos' }
    ];
    
    for (const category of expenseCategories) {
      const id = uuidv4();
      await db.query(
        'INSERT INTO expense_categories (id, user_id, name, color, description, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [id, userId, category.name, category.color, category.description, 1]
      );
      console.log(`✅ Categoria criada: ${category.name}`);
    }
    
    // 3. Buscar IDs das fontes e categorias criadas
    const [sourcesRows] = await db.query('SELECT id, name FROM income_sources WHERE user_id = ?', [userId]);
    const [categoriesRows] = await db.query('SELECT id, name FROM expense_categories WHERE user_id = ?', [userId]);
    
    // 4. Criar receitas de exemplo
    console.log('\n💰 Criando receitas de exemplo...');
    const incomes = [
      { sourceId: sourcesRows[0].id, description: 'Honorários Janeiro - Empresa ABC', amount: 5000, date: '2025-01-15', client: 'Empresa ABC Ltda' },
      { sourceId: sourcesRows[1].id, description: 'Consultoria Estratégica - XYZ Corp', amount: 8000, date: '2025-01-20', client: 'XYZ Corp' },
      { sourceId: sourcesRows[2].id, description: 'Abertura de Empresa - Startup Tech', amount: 1500, date: '2025-01-25', client: 'Startup Tech' },
      { sourceId: sourcesRows[3].id, description: 'Auditoria Trimestral - Indústria DEF', amount: 12000, date: '2025-01-30', client: 'Indústria DEF' },
      { sourceId: sourcesRows[4].id, description: 'Declaração IR PF - Cliente Individual', amount: 300, date: '2025-02-01', client: 'João Silva' }
    ];
    
    for (const income of incomes) {
      const id = uuidv4();
      await db.query(
        'INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [id, userId, income.sourceId, income.description, income.amount, income.date, 'PIX', income.client, 'Receita de exemplo']
      );
      console.log(`✅ Receita criada: ${income.description} - R$ ${income.amount}`);
    }
    
    // 5. Criar despesas de exemplo
    console.log('\n💸 Criando despesas de exemplo...');
    const expenses = [
      { categoryId: categoriesRows[0].id, description: 'Aluguel Escritório Janeiro', amount: 2500, date: '2025-01-05' },
      { categoryId: categoriesRows[1].id, description: 'Salário Contador Junior', amount: 3000, date: '2025-01-05' },
      { categoryId: categoriesRows[2].id, description: 'Material Escritório e Impressão', amount: 450, date: '2025-01-10' },
      { categoryId: categoriesRows[3].id, description: 'Licença Software Contábil', amount: 800, date: '2025-01-15' },
      { categoryId: categoriesRows[4].id, description: 'Conta de Energia Elétrica', amount: 320, date: '2025-01-20' },
      { categoryId: categoriesRows[5].id, description: 'Internet e Telefone', amount: 180, date: '2025-01-20' },
      { categoryId: categoriesRows[6].id, description: 'Marketing Digital Google Ads', amount: 600, date: '2025-01-25' },
      { categoryId: categoriesRows[7].id, description: 'DARF - Simples Nacional', amount: 850, date: '2025-01-30' }
    ];
    
    for (const expense of expenses) {
      const id = uuidv4();
      await db.query(
        'INSERT INTO expenses (id, user_id, category_id, description, amount, date, payment_method, supplier, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [id, userId, expense.categoryId, expense.description, expense.amount, expense.date, 'PIX', 'Fornecedor', 'Despesa de exemplo']
      );
      console.log(`✅ Despesa criada: ${expense.description} - R$ ${expense.amount}`);
    }
    
    // 6. Criar obrigações tributárias
    console.log('\n📋 Criando obrigações tributárias...');
    const obligations = [
      { name: 'IRPJ - Janeiro 2025', type: 'IRPJ', amount: 2500, dueDate: '2025-01-31', status: 'pendente' },
      { name: 'CSLL - Janeiro 2025', type: 'CSLL', amount: 1200, dueDate: '2025-01-31', status: 'pendente' },
      { name: 'PIS/COFINS - Janeiro 2025', type: 'PIS/COFINS', amount: 850, dueDate: '2025-02-15', status: 'pendente' },
      { name: 'ISS - Janeiro 2025', type: 'ISS', amount: 450, dueDate: '2025-02-10', status: 'pago' },
      { name: 'Simples Nacional - Janeiro 2025', type: 'Simples Nacional', amount: 1800, dueDate: '2025-02-20', status: 'pendente' },
      { name: 'FGTS - Janeiro 2025', type: 'FGTS', amount: 240, dueDate: '2025-02-07', status: 'pendente' }
    ];
    
    for (const obligation of obligations) {
      const id = uuidv4();
      await db.query(
        'INSERT INTO tax_obligations (id, user_id, name, description, type, due_date, amount, status, frequency, reference_month, notes, tax_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [id, userId, obligation.name, `${obligation.type} referente ao mês de Janeiro/2025`, obligation.type, obligation.dueDate, obligation.amount, obligation.status, 'mensal', '2025-01', 'Obrigação de exemplo', obligation.type]
      );
      console.log(`✅ Obrigação criada: ${obligation.name} - R$ ${obligation.amount} (${obligation.status})`);
    }
    
    // 7. Resumo final
    console.log('\n📊 Resumo dos dados criados:');
    const [incomeCount] = await db.query('SELECT COUNT(*) as count FROM incomes WHERE user_id = ?', [userId]);
    const [expenseCount] = await db.query('SELECT COUNT(*) as count FROM expenses WHERE user_id = ?', [userId]);
    const [obligationCount] = await db.query('SELECT COUNT(*) as count FROM tax_obligations WHERE user_id = ?', [userId]);
    const [sourceCount] = await db.query('SELECT COUNT(*) as count FROM income_sources WHERE user_id = ?', [userId]);
    const [categoryCount] = await db.query('SELECT COUNT(*) as count FROM expense_categories WHERE user_id = ?', [userId]);
    
    console.log(`- Fontes de receita: ${sourceCount[0].count}`);
    console.log(`- Categorias de despesa: ${categoryCount[0].count}`);
    console.log(`- Receitas: ${incomeCount[0].count}`);
    console.log(`- Despesas: ${expenseCount[0].count}`);
    console.log(`- Obrigações tributárias: ${obligationCount[0].count}`);
    
    console.log('\n✅ Configuração completa do usuário Italo finalizada!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar dados:', error.message);
  } finally {
    await db.end();
  }
}

setupItaloData();
