const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function populateDefaultData() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company'
  });

  try {
    console.log('Populando dados padrão no MySQL...');

    // Verificar se já existem dados padrão
    const [existingIncome] = await db.execute('SELECT COUNT(*) as count FROM income_sources WHERE user_id = "default"');
    const [existingExpenses] = await db.execute('SELECT COUNT(*) as count FROM expense_categories WHERE user_id = "default"');

    if (existingIncome[0].count > 0 || existingExpenses[0].count > 0) {
      console.log('⚠️ Dados padrão já existem. Removendo dados antigos...');
      await db.execute('DELETE FROM income_sources WHERE user_id = "default"');
      await db.execute('DELETE FROM expense_categories WHERE user_id = "default"');
    }

    // Fontes de receita padrão para empresas de contabilidade
    const incomeSources = [
      { name: 'Honorários Contábeis', type: 'servico', color: '#22c55e', account_code: '3.1.01' },
      { name: 'Consultoria Empresarial', type: 'servico', color: '#3b82f6', account_code: '3.1.02' },
      { name: 'Auditoria', type: 'servico', color: '#8b5cf6', account_code: '3.1.03' },
      { name: 'Abertura de Empresas', type: 'servico', color: '#f59e0b', account_code: '3.1.04' },
      { name: 'Consultoria Tributária', type: 'servico', color: '#ef4444', account_code: '3.1.05' },
      { name: 'Perícia Contábil', type: 'servico', color: '#06b6d4', account_code: '3.1.06' },
      { name: 'Assessoria Fiscal', type: 'servico', color: '#84cc16', account_code: '3.1.07' },
      { name: 'Cursos e Treinamentos', type: 'produto', color: '#f97316', account_code: '3.1.08' }
    ];

    // Categorias de despesa padrão
    const expenseCategories = [
      { name: 'Aluguel', color: '#dc2626', account_code: '4.1.01' },
      { name: 'Salários', color: '#059669', account_code: '4.1.02' },
      { name: 'Material de Escritório', color: '#0891b2', account_code: '4.1.03' },
      { name: 'Software e Licenças', color: '#7c3aed', account_code: '4.1.04' },
      { name: 'Energia Elétrica', color: '#ea580c', account_code: '4.1.05' },
      { name: 'Telefone/Internet', color: '#0d9488', account_code: '4.1.06' },
      { name: 'Marketing', color: '#be185d', account_code: '4.1.07' },
      { name: 'Contabilidade', color: '#4338ca', account_code: '4.1.08' },
      { name: 'Impostos', color: '#991b1b', account_code: '4.1.09' },
      { name: 'Viagens', color: '#92400e', account_code: '4.1.10' }
    ];

    // Inserir fontes de receita
    for (const source of incomeSources) {
      await db.execute(
        'INSERT INTO income_sources (id, user_id, name, type, color, account_code, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [uuidv4(), 'default', source.name, source.type, source.color, source.account_code, 1]
      );
    }

    // Inserir categorias de despesa
    for (const category of expenseCategories) {
      await db.execute(
        'INSERT INTO expense_categories (id, user_id, name, color, account_code, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [uuidv4(), 'default', category.name, category.color, category.account_code, 1]
      );
    }

    console.log(`✅ Inseridas ${incomeSources.length} fontes de receita padrão`);
    console.log(`✅ Inseridas ${expenseCategories.length} categorias de despesa padrão`);
    console.log('✅ Dados padrão populados com sucesso no MySQL!');

  } catch (error) {
    console.error('❌ Erro ao popular dados padrão:', error);
  } finally {
    await db.end();
  }
}

populateDefaultData();
