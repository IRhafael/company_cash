const BASE_URL = 'http://localhost:3001/api';
let AUTH_TOKEN = '';

// Função para fazer login e obter token
async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'devrhafael@outlook.com',
      password: 'senha123'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Login failed! status: ${response.status}`);
  }
  
  const data = await response.json();
  AUTH_TOKEN = `Bearer ${data.token}`;
  console.log('✅ Login realizado com sucesso!');
  return data;
}

// Função para fazer requisições HTTP
async function fetchData(url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

async function inspectAPIData() {
  try {
    console.log('🔍 INSPECIONANDO DADOS DA API\n');

    // 0. Fazer login
    console.log('0. Fazendo login...');
    await login();

    // 1. Inspecionar estrutura das receitas
    console.log('\n1. Estrutura das receitas:');
    const incomesResponse = await fetchData(`${BASE_URL}/incomes`);
    const incomes = incomesResponse.data || [];
    
    if (incomes.length > 0) {
      const firstIncome = incomes[0];
      console.log('   Primeira receita (estrutura completa):');
      console.log('   ', JSON.stringify(firstIncome, null, 2));
      
      console.log('\n   Campos de relacionamento disponíveis:');
      Object.keys(firstIncome).forEach(key => {
        if (key.toLowerCase().includes('source') || key.toLowerCase().includes('id')) {
          console.log(`     - ${key}: ${firstIncome[key]}`);
        }
      });
    }

    // 2. Inspecionar estrutura das despesas
    console.log('\n2. Estrutura das despesas:');
    const expenses = await fetchData(`${BASE_URL}/expenses`);
    
    if (expenses.length > 0) {
      const firstExpense = expenses[0];
      console.log('   Primeira despesa (estrutura completa):');
      console.log('   ', JSON.stringify(firstExpense, null, 2));
      
      console.log('\n   Campos de relacionamento disponíveis:');
      Object.keys(firstExpense).forEach(key => {
        if (key.toLowerCase().includes('category') || key.toLowerCase().includes('id')) {
          console.log(`     - ${key}: ${firstExpense[key]}`);
        }
      });
    }

    // 3. Inspecionar estrutura das fontes
    console.log('\n3. Estrutura das fontes:');
    const sources = await fetchData(`${BASE_URL}/income-sources`);
    
    if (sources.length > 0) {
      const firstSource = sources[0];
      console.log('   Primeira fonte (estrutura completa):');
      console.log('   ', JSON.stringify(firstSource, null, 2));
    }

    // 4. Inspecionar estrutura das categorias
    console.log('\n4. Estrutura das categorias:');
    const categories = await fetchData(`${BASE_URL}/expense-categories`);
    
    if (categories.length > 0) {
      const firstCategory = categories[0];
      console.log('   Primeira categoria (estrutura completa):');
      console.log('   ', JSON.stringify(firstCategory, null, 2));
    }

    // 5. Testar mapeamento manual
    console.log('\n5. Testando mapeamento manual...');
    
    console.log('\n   Testando receitas por fonte:');
    sources.forEach(source => {
      const matchingIncomes = incomes.filter(income => {
        // Testar diferentes possibilidades de campo
        return income.sourceId === source.id || 
               income.source_id === source.id || 
               income.incomeSourceId === source.id;
      });
      
      const total = matchingIncomes.reduce((sum, income) => {
        const amount = typeof income.amount === 'string' ? parseFloat(income.amount) : income.amount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      if (matchingIncomes.length > 0) {
        console.log(`     ✅ ${source.name}: ${matchingIncomes.length} receitas, R$ ${total.toFixed(2)}`);
      } else {
        console.log(`     ❌ ${source.name}: 0 receitas`);
      }
    });
    
    console.log('\n   Testando despesas por categoria:');
    categories.forEach(category => {
      const matchingExpenses = expenses.filter(expense => {
        // Testar diferentes possibilidades de campo
        return expense.categoryId === category.id || 
               expense.category_id === category.id || 
               expense.expenseCategoryId === category.id;
      });
      
      const total = matchingExpenses.reduce((sum, expense) => {
        const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      if (matchingExpenses.length > 0) {
        console.log(`     ✅ ${category.name}: ${matchingExpenses.length} despesas, R$ ${total.toFixed(2)}`);
      } else {
        console.log(`     ❌ ${category.name}: 0 despesas`);
      }
    });

    console.log('\n✅ Inspeção concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a inspeção:', error.message);
  }
}

inspectAPIData();
