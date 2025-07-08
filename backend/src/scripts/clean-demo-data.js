const mysql = require('mysql2/promise');

async function cleanDemoData() {
  let connection;
  
  try {
    // Conectar ao banco MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🧹 Limpando dados demo do sistema...\n');

    // 1. Buscar usuários demo
    console.log('1. Identificando usuários demo...');
    const [demoUsers] = await connection.execute(`
      SELECT id, email, name FROM users 
      WHERE email LIKE '%demo%' OR email LIKE '%example%' OR email LIKE '%teste%'
      AND email != 'devrhafael@outlook.com'
    `);
    
    console.log(`   Encontrados ${demoUsers.length} usuários demo:`);
    demoUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`);
    });

    if (demoUsers.length === 0) {
      console.log('   ✅ Nenhum usuário demo encontrado para remover');
      return;
    }

    // 2. Remover dados relacionados aos usuários demo
    for (const user of demoUsers) {
      console.log(`\n2. Removendo dados do usuário: ${user.email}`);
      
      // Receitas
      const [incomes] = await connection.execute(
        'SELECT COUNT(*) as count FROM incomes WHERE user_id = ?',
        [user.id]
      );
      console.log(`   💰 Receitas: ${incomes[0].count}`);
      
      await connection.execute('DELETE FROM incomes WHERE user_id = ?', [user.id]);
      
      // Despesas
      const [expenses] = await connection.execute(
        'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
        [user.id]
      );
      console.log(`   💸 Despesas: ${expenses[0].count}`);
      
      await connection.execute('DELETE FROM expenses WHERE user_id = ?', [user.id]);
      
      // Obrigações tributárias
      const [obligations] = await connection.execute(
        'SELECT COUNT(*) as count FROM tax_obligations WHERE user_id = ?',
        [user.id]
      );
      console.log(`   📋 Obrigações: ${obligations[0].count}`);
      
      await connection.execute('DELETE FROM tax_obligations WHERE user_id = ?', [user.id]);
      
      // Fontes de receita
      const [sources] = await connection.execute(
        'SELECT COUNT(*) as count FROM income_sources WHERE user_id = ?',
        [user.id]
      );
      console.log(`   📊 Fontes de receita: ${sources[0].count}`);
      
      await connection.execute('DELETE FROM income_sources WHERE user_id = ?', [user.id]);
      
      // Categorias de despesa
      const [categories] = await connection.execute(
        'SELECT COUNT(*) as count FROM expense_categories WHERE user_id = ?',
        [user.id]
      );
      console.log(`   🏷️ Categorias de despesa: ${categories[0].count}`);
      
      await connection.execute('DELETE FROM expense_categories WHERE user_id = ?', [user.id]);
      
      // Remover usuário
      await connection.execute('DELETE FROM users WHERE id = ?', [user.id]);
      console.log(`   ✅ Usuário ${user.email} removido completamente`);
    }

    // 3. Verificar estado final
    console.log('\n3. Verificando estado final...');
    
    const [finalUsers] = await connection.execute('SELECT email, name FROM users');
    console.log(`   👥 Usuários restantes: ${finalUsers.length}`);
    finalUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`);
    });
    
    // Verificar dados do usuário italo
    const [italoData] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM incomes WHERE user_id = 'user-italo-1751997790402') as receitas,
        (SELECT COUNT(*) FROM expenses WHERE user_id = 'user-italo-1751997790402') as despesas,
        (SELECT COUNT(*) FROM tax_obligations WHERE user_id = 'user-italo-1751997790402') as obrigacoes,
        (SELECT COUNT(*) FROM income_sources WHERE user_id = 'user-italo-1751997790402') as fontes,
        (SELECT COUNT(*) FROM expense_categories WHERE user_id = 'user-italo-1751997790402') as categorias
    `);
    
    const data = italoData[0];
    console.log(`\n📊 Dados do usuário Italo:`);
    console.log(`   💰 Receitas: ${data.receitas}`);
    console.log(`   💸 Despesas: ${data.despesas}`);
    console.log(`   📋 Obrigações: ${data.obrigacoes}`);
    console.log(`   📊 Fontes: ${data.fontes}`);
    console.log(`   🏷️ Categorias: ${data.categorias}`);

    console.log('\n✅ Limpeza concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

cleanDemoData();
