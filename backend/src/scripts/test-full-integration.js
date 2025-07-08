async function testFullIntegration() {
  console.log('🧪 Testando integração completa frontend-backend...');

  try {
    console.log('\n🔐 1. Fazendo login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'devrhafael@outlook.com',
        password: 'Viver321'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Erro no login: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login realizado!');
    console.log('User ID:', loginData.user.id);
    console.log('User Name:', loginData.user.name);

    const token = loginData.token;

    console.log('\n📊 2. Testando fontes de receita...');
    const sourcesResponse = await fetch('http://localhost:3001/api/income-sources', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const sourcesData = await sourcesResponse.json();
    console.log(`✅ Fontes encontradas: ${Array.isArray(sourcesData) ? sourcesData.length : 0}`);
    if (Array.isArray(sourcesData) && sourcesData.length > 0) {
      console.log('   Primeira fonte:', sourcesData[0].name);
    }

    console.log('\n💰 3. Testando receitas...');
    const incomesResponse = await fetch('http://localhost:3001/api/incomes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const incomesData = await incomesResponse.json();
    const incomes = incomesData.data || [];
    console.log(`✅ Receitas encontradas: ${incomes.length}`);
    console.log('Total de receitas:', incomesData.total || 0);
    
    if (incomes && incomes.length > 0) {
      console.log('   Primeiras 3 receitas:');
      incomes.slice(0, 3).forEach((income, i) => {
        console.log(`   ${i + 1}. ${income.description} - R$ ${income.amount} (${income.date})`);
      });
      
      const totalAmount = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
      console.log(`   💰 Total calculado: R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    }

    console.log('\n💸 4. Testando despesas...');
    const expensesResponse = await fetch('http://localhost:3001/api/expenses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const expensesData = await expensesResponse.json();
    const expenses = Array.isArray(expensesData) ? expensesData : [];
    console.log(`✅ Despesas encontradas: ${expenses.length}`);
    
    if (expenses.length > 0) {
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      console.log(`   💸 Total calculado: R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    }

    console.log('\n📋 5. Testando obrigações tributárias...');
    const taxResponse = await fetch('http://localhost:3001/api/tax-obligations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const taxData = await taxResponse.json();
    const taxes = Array.isArray(taxData) ? taxData : [];
    console.log(`✅ Obrigações encontradas: ${taxes.length}`);
    
    if (taxes.length > 0) {
      const totalTax = taxes.reduce((sum, tax) => sum + parseFloat(tax.amount), 0);
      console.log(`   📋 Total calculado: R$ ${totalTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    }

    console.log('\n🎯 6. Resumo financeiro...');
    const totalIncomes = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalTaxes = taxes.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netProfit = totalIncomes - totalExpenses - totalTaxes;

    console.log(`💰 Receitas totais: R$ ${totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`💸 Despesas totais: R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`📋 Obrigações totais: R$ ${totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`🎯 Lucro líquido: R$ ${netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);

    console.log('\n✅ Teste de integração concluído!');
    console.log('🌐 Agora acesse http://localhost:5173 e faça login para ver os dados!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testFullIntegration();
