async function deepDebugAPI() {
  console.log('🔬 Debug profundo da API...');

  try {
    // Login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'devrhafael@outlook.com',
        password: 'Viver321'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    const headers = { 'Authorization': `Bearer ${token}` };

    console.log('🔍 Analisando estrutura dos dados detalhadamente...');

    // Testar cada endpoint individualmente
    console.log('\n1. RECEITAS:');
    const incomesResponse = await fetch('http://localhost:3001/api/incomes', { headers });
    const incomesData = await incomesResponse.json();
    console.log('   Raw response:', JSON.stringify(incomesData, null, 2));
    console.log('   Tipo da resposta:', typeof incomesData);
    console.log('   É array?', Array.isArray(incomesData));
    console.log('   Tem propriedade data?', 'data' in incomesData);
    
    if (incomesData.data && incomesData.data.length > 0) {
      const firstIncome = incomesData.data[0];
      console.log('   Primeira receita:', firstIncome);
      console.log('   Tipo do amount:', typeof firstIncome.amount);
      console.log('   Valor do amount:', firstIncome.amount);
      console.log('   parseFloat do amount:', parseFloat(firstIncome.amount));
      console.log('   É NaN?', isNaN(parseFloat(firstIncome.amount)));
    }

    console.log('\n2. DESPESAS:');
    const expensesResponse = await fetch('http://localhost:3001/api/expenses', { headers });
    const expensesData = await expensesResponse.json();
    console.log('   Raw response tipo:', typeof expensesData);
    console.log('   É array?', Array.isArray(expensesData));
    
    if (Array.isArray(expensesData) && expensesData.length > 0) {
      const firstExpense = expensesData[0];
      console.log('   Primeira despesa:', firstExpense);
      console.log('   Tipo do amount:', typeof firstExpense.amount);
      console.log('   Valor do amount:', firstExpense.amount);
      console.log('   parseFloat do amount:', parseFloat(firstExpense.amount));
      console.log('   É NaN?', isNaN(parseFloat(firstExpense.amount)));
    }

    console.log('\n3. FONTES DE RECEITA:');
    const sourcesResponse = await fetch('http://localhost:3001/api/income-sources', { headers });
    const sourcesData = await sourcesResponse.json();
    console.log('   Raw response tipo:', typeof sourcesData);
    console.log('   É array?', Array.isArray(sourcesData));
    console.log('   Quantidade:', sourcesData.length);

    console.log('\n4. CATEGORIAS DE DESPESA:');
    const categoriesResponse = await fetch('http://localhost:3001/api/expense-categories', { headers });
    const categoriesData = await categoriesResponse.json();
    console.log('   Raw response tipo:', typeof categoriesData);
    console.log('   É array?', Array.isArray(categoriesData));
    console.log('   Quantidade:', categoriesData.length);

    console.log('\n5. OBRIGAÇÕES TRIBUTÁRIAS:');
    const taxResponse = await fetch('http://localhost:3001/api/tax-obligations', { headers });
    const taxData = await taxResponse.json();
    console.log('   Raw response tipo:', typeof taxData);
    console.log('   É array?', Array.isArray(taxData));
    
    if (Array.isArray(taxData) && taxData.length > 0) {
      const firstTax = taxData[0];
      console.log('   Primeira obrigação:', firstTax);
      console.log('   Tipo do amount:', typeof firstTax.amount);
      console.log('   Valor do amount:', firstTax.amount);
      console.log('   parseFloat do amount:', parseFloat(firstTax.amount));
      console.log('   É NaN?', isNaN(parseFloat(firstTax.amount)));
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

deepDebugAPI();
