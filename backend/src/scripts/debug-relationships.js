const mysql = require('mysql2/promise');

async function debugRelationships() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🔍 DEBUGGING RELACIONAMENTOS DOS DADOS\n');

    // 1. Verificar receitas e seus sourceId
    console.log('1. Receitas e suas fontes:');
    const [incomes] = await connection.execute(`
      SELECT i.id, i.description, i.amount, i.source_id, s.name as source_name
      FROM incomes i
      LEFT JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = 'user-italo-1751997790402'
      ORDER BY i.created_at DESC
      LIMIT 10
    `);
    
    incomes.forEach(income => {
      console.log(`   - ${income.description}: R$ ${income.amount} (sourceId: ${income.source_id}) -> ${income.source_name || 'FONTE NÃO ENCONTRADA'}`);
    });

    // 2. Verificar fontes disponíveis
    console.log('\n2. Fontes de receita disponíveis:');
    const [sources] = await connection.execute(`
      SELECT id, name, user_id
      FROM income_sources
      WHERE user_id = 'user-italo-1751997790402'
    `);
    
    sources.forEach(source => {
      console.log(`   - ${source.name} (ID: ${source.id})`);
    });

    // 3. Verificar despesas e seus categoryId
    console.log('\n3. Despesas e suas categorias:');
    const [expenses] = await connection.execute(`
      SELECT e.id, e.description, e.amount, e.category_id, c.name as category_name
      FROM expenses e
      LEFT JOIN expense_categories c ON e.category_id = c.id
      WHERE e.user_id = 'user-italo-1751997790402'
      ORDER BY e.created_at DESC
      LIMIT 10
    `);
    
    expenses.forEach(expense => {
      console.log(`   - ${expense.description}: R$ ${expense.amount} (categoryId: ${expense.category_id}) -> ${expense.category_name || 'CATEGORIA NÃO ENCONTRADA'}`);
    });

    // 4. Verificar categorias disponíveis
    console.log('\n4. Categorias de despesa disponíveis:');
    const [categories] = await connection.execute(`
      SELECT id, name, user_id
      FROM expense_categories
      WHERE user_id = 'user-italo-1751997790402'
    `);
    
    categories.forEach(category => {
      console.log(`   - ${category.name} (ID: ${category.id})`);
    });

    // 5. Contar relacionamentos órfãos
    console.log('\n5. Verificando relacionamentos órfãos:');
    
    const [orphanIncomes] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM incomes i
      LEFT JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = 'user-italo-1751997790402' AND s.id IS NULL
    `);
    
    const [orphanExpenses] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM expenses e
      LEFT JOIN expense_categories c ON e.category_id = c.id
      WHERE e.user_id = 'user-italo-1751997790402' AND c.id IS NULL
    `);
    
    console.log(`   📊 Receitas sem fonte válida: ${orphanIncomes[0].count}`);
    console.log(`   📊 Despesas sem categoria válida: ${orphanExpenses[0].count}`);

    // 6. Se há órfãos, vamos corrigir
    if (orphanIncomes[0].count > 0 || orphanExpenses[0].count > 0) {
      console.log('\n6. Corrigindo relacionamentos órfãos...');
      
      // Pegar primeira fonte disponível
      if (sources.length > 0 && orphanIncomes[0].count > 0) {
        const firstSource = sources[0];
        console.log(`   Corrigindo receitas órfãs para usar fonte: ${firstSource.name}`);
        
        await connection.execute(`
          UPDATE incomes 
          SET source_id = ?
          WHERE user_id = 'user-italo-1751997790402' 
          AND source_id NOT IN (SELECT id FROM income_sources WHERE user_id = 'user-italo-1751997790402')
        `, [firstSource.id]);
      }
      
      // Pegar primeira categoria disponível
      if (categories.length > 0 && orphanExpenses[0].count > 0) {
        const firstCategory = categories[0];
        console.log(`   Corrigindo despesas órfãs para usar categoria: ${firstCategory.name}`);
        
        await connection.execute(`
          UPDATE expenses 
          SET category_id = ?
          WHERE user_id = 'user-italo-1751997790402' 
          AND category_id NOT IN (SELECT id FROM expense_categories WHERE user_id = 'user-italo-1751997790402')
        `, [firstCategory.id]);
      }
      
      console.log('   ✅ Relacionamentos corrigidos!');
    } else {
      console.log('   ✅ Todos os relacionamentos estão corretos!');
    }

    console.log('\n✅ Debug concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

debugRelationships();
