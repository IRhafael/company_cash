async function testFrontendIntegration() {
  console.log('🔍 Testando o que o frontend está recebendo...');

  try {
    // Simular o que o frontend faz
    const baseUrl = 'http://localhost:3001/api';

    // 1. Login
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'devrhafael@outlook.com',
        password: 'Viver321'
      })
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login OK');

    // 2. Carregar todos os dados como o AppContext faz
    console.log('\n2. Carregando dados como o AppContext...');
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    const [
      incomeSourcesResponse,
      expenseCategoriesResponse,
      incomesResponse,
      expensesResponse,
      taxObligationsResponse
    ] = await Promise.all([
      fetch(`${baseUrl}/income-sources`, { headers }),
      fetch(`${baseUrl}/expense-categories`, { headers }),
      fetch(`${baseUrl}/incomes`, { headers }),
      fetch(`${baseUrl}/expenses`, { headers }),
      fetch(`${baseUrl}/tax-obligations`, { headers })
    ]);

    const incomeSourcesData = await incomeSourcesResponse.json();
    const expenseCategoriesData = await expenseCategoriesResponse.json();
    const incomesData = await incomesResponse.json();
    const expensesData = await expensesResponse.json();
    const taxObligationsData = await taxObligationsResponse.json();

    console.log('📊 Fontes de receita:', Array.isArray(incomeSourcesData) ? incomeSourcesData.length : 'ERRO: não é array');
    console.log('📊 Categorias de despesa:', Array.isArray(expenseCategoriesData) ? expenseCategoriesData.length : 'ERRO: não é array');
    console.log('💰 Receitas:', incomesData.data ? incomesData.data.length : 'ERRO: sem data');
    console.log('💸 Despesas:', Array.isArray(expensesData) ? expensesData.length : 'ERRO: não é array');
    console.log('📋 Obrigações:', Array.isArray(taxObligationsData) ? taxObligationsData.length : 'ERRO: não é array');

    // 3. Simular cálculos do useFinancialCalculations
    console.log('\n3. Simulando cálculos financeiros...');
    
    const incomes = incomesData.data || [];
    const expenses = expensesData || [];
    const sources = incomeSourcesData || [];
    const categories = expenseCategoriesData || [];

    console.log('   Receitas para cálculo:', incomes.length);
    console.log('   Despesas para cálculo:', expenses.length);
    console.log('   Fontes para cálculo:', sources.length);
    console.log('   Categorias para cálculo:', categories.length);

    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const netProfit = totalIncome - totalExpenses;

    console.log('   💰 Total de receitas:', totalIncome);
    console.log('   💸 Total de despesas:', totalExpenses);
    console.log('   🎯 Lucro líquido:', netProfit);

    if (isNaN(totalIncome) || isNaN(totalExpenses)) {
      console.log('❌ PROBLEMA: Valores NaN detectados!');
      console.log('   Sample income:', incomes[0]);
      console.log('   Sample expense:', expenses[0]);
    } else {
      console.log('✅ Cálculos OK - valores numéricos válidos');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testFrontendIntegration();
