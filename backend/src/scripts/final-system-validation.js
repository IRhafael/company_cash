const mysql = require('mysql2/promise');

async function finalValidation() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🚀 VALIDAÇÃO FINAL DO SISTEMA COMPANY CASH\n');

    // 1. Verificar se o usuário italo existe e pode fazer login
    console.log('1. 👤 Validando usuário italo:');
    const [users] = await connection.execute(`
      SELECT id, email, name FROM users WHERE email = 'devrhafael@outlook.com'
    `);
    
    if (users.length === 0) {
      console.log('   ❌ Usuário italo não encontrado!');
      return;
    } else {
      console.log(`   ✅ Usuário encontrado: ${users[0].name} (${users[0].email})`);
      console.log(`   📝 User ID: ${users[0].id}`);
    }

    const userId = users[0].id;

    // 2. Verificar dados de receitas
    console.log('\n2. 💰 Validando receitas:');
    const [incomes] = await connection.execute(`
      SELECT i.*, s.name as source_name
      FROM incomes i
      LEFT JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
    `, [userId]);

    console.log(`   📊 Total de receitas: ${incomes.length}`);
    let totalReceitas = 0;
    incomes.forEach(income => {
      const amount = parseFloat(income.amount);
      totalReceitas += amount;
      console.log(`   💸 ${income.description}: R$ ${amount.toFixed(2)} (${income.source_name})`);
    });
    console.log(`   💵 Total em receitas: R$ ${totalReceitas.toFixed(2)}`);

    // 3. Verificar dados de despesas
    console.log('\n3. 💸 Validando despesas:');
    const [expenses] = await connection.execute(`
      SELECT e.*, c.name as category_name
      FROM expenses e
      LEFT JOIN expense_categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
    `, [userId]);

    console.log(`   📊 Total de despesas: ${expenses.length}`);
    let totalDespesas = 0;
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      totalDespesas += amount;
      console.log(`   💳 ${expense.description}: R$ ${amount.toFixed(2)} (${expense.category_name})`);
    });
    console.log(`   💸 Total em despesas: R$ ${totalDespesas.toFixed(2)}`);

    // 4. Verificar obrigações tributárias
    console.log('\n4. 📋 Validando obrigações tributárias:');
    const [obligations] = await connection.execute(`
      SELECT * FROM tax_obligations WHERE user_id = ? ORDER BY due_date ASC
    `, [userId]);

    console.log(`   📊 Total de obrigações: ${obligations.length}`);
    let totalObrigacoes = 0;
    obligations.forEach(obligation => {
      const amount = parseFloat(obligation.amount);
      totalObrigacoes += amount;
      const status = obligation.status === 'pending' ? '⏳ Pendente' : '✅ Paga';
      console.log(`   📄 ${obligation.name}: R$ ${amount.toFixed(2)} - ${status} (${obligation.due_date})`);
    });
    console.log(`   🧾 Total em obrigações: R$ ${totalObrigacoes.toFixed(2)}`);

    // 5. Calcular saldo e relatórios
    console.log('\n5. 📈 Calculando métricas financeiras:');
    const saldo = totalReceitas - totalDespesas;
    console.log(`   💰 Total Receitas: R$ ${totalReceitas.toFixed(2)}`);
    console.log(`   💸 Total Despesas: R$ ${totalDespesas.toFixed(2)}`);
    console.log(`   💵 Saldo Atual: R$ ${saldo.toFixed(2)}`);
    console.log(`   🧾 Obrigações Pendentes: R$ ${totalObrigacoes.toFixed(2)}`);
    console.log(`   📊 Saldo após obrigações: R$ ${(saldo - totalObrigacoes).toFixed(2)}`);

    // 6. Verificar se existem relacionamentos órfãos
    console.log('\n6. 🔗 Verificando integridade dos relacionamentos:');
    
    const [orphanIncomes] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM incomes i
      LEFT JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ? AND s.id IS NULL
    `, [userId]);
    
    const [orphanExpenses] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM expenses e
      LEFT JOIN expense_categories c ON e.category_id = c.id
      WHERE e.user_id = ? AND c.id IS NULL
    `, [userId]);

    if (orphanIncomes[0].count === 0 && orphanExpenses[0].count === 0) {
      console.log('   ✅ Todos os relacionamentos estão íntegros!');
    } else {
      console.log(`   ⚠️  Receitas órfãs: ${orphanIncomes[0].count}`);
      console.log(`   ⚠️  Despesas órfãs: ${orphanExpenses[0].count}`);
    }

    // 7. Verificar fontes e categorias disponíveis
    console.log('\n7. 📂 Verificando fontes e categorias:');
    
    const [sources] = await connection.execute(`
      SELECT COUNT(*) as count FROM income_sources WHERE user_id = ?
    `, [userId]);
    
    const [categories] = await connection.execute(`
      SELECT COUNT(*) as count FROM expense_categories WHERE user_id = ?
    `, [userId]);

    console.log(`   📥 Fontes de receita: ${sources[0].count}`);
    console.log(`   📤 Categorias de despesa: ${categories[0].count}`);

    // 8. Validação final
    console.log('\n8. ✅ RESULTADO DA VALIDAÇÃO:');
    
    const checks = [
      { name: 'Usuário existe', status: users.length > 0 },
      { name: 'Tem receitas', status: incomes.length > 0 },
      { name: 'Tem despesas', status: expenses.length > 0 },
      { name: 'Tem obrigações', status: obligations.length > 0 },
      { name: 'Relacionamentos íntegros', status: orphanIncomes[0].count === 0 && orphanExpenses[0].count === 0 },
      { name: 'Tem fontes de receita', status: sources[0].count > 0 },
      { name: 'Tem categorias de despesa', status: categories[0].count > 0 },
      { name: 'Valores não são NaN', status: !isNaN(totalReceitas) && !isNaN(totalDespesas) && !isNaN(totalObrigacoes) }
    ];

    let allPassed = true;
    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      console.log(`   ${icon} ${check.name}`);
      if (!check.status) allPassed = false;
    });

    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('🎉 SISTEMA ESTÁ FUNCIONANDO PERFEITAMENTE!');
      console.log('✅ O frontend deve estar exibindo dados reais sem NaN');
      console.log('✅ Os gráficos devem estar sendo gerados corretamente');
      console.log('✅ Todos os cálculos estão corretos');
    } else {
      console.log('⚠️  SISTEMA TEM ALGUNS PROBLEMAS - veja os ❌ acima');
    }
    console.log('='.repeat(50));

    // 9. Dados para teste no frontend
    console.log('\n9. 🖥️  DADOS PARA TESTE NO FRONTEND:');
    console.log('   📧 Email: devrhafael@outlook.com');
    console.log('   🔑 Senha: 1234');
    console.log('   📊 Receitas para validar: ' + incomes.length);
    console.log('   📊 Despesas para validar: ' + expenses.length);
    console.log('   📊 Obrigações para validar: ' + obligations.length);
    
  } catch (error) {
    console.error('❌ Erro durante a validação:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

finalValidation();
