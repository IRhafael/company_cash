const BASE_URL = 'http://localhost:3001/api';

let AUTH_TOKEN = '';

// Função para fazer login e obter token
async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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

// Função para simular o parseAmount do frontend
function parseAmount(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove caracteres não numéricos exceto ponto e vírgula
    const cleaned = value.replace(/[^\d.,-]/g, '');
    // Converte vírgula para ponto se necessário
    const normalized = cleaned.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

async function testFrontendValidation() {
  try {
    console.log('🔍 Testando validação do frontend...\n');

    // 0. Fazer login primeiro
    console.log('0. Fazendo login...');
    await login();

    // 1. Buscar receitas
    console.log('1. Testando receitas...');
    const incomesResponse = await fetchData(`${BASE_URL}/incomes`);
    const incomes = incomesResponse.data || [];
    console.log(`   ✅ ${incomes.length} receitas encontradas`);
    
    if (incomes.length > 0) {
      const firstIncome = incomes[0];
      console.log(`   📊 Primeira receita: ${firstIncome.description} - R$ ${firstIncome.amount}`);
      const parsedAmount = parseAmount(firstIncome.amount);
      console.log(`   🔢 Valor parseado: ${parsedAmount} (tipo: ${typeof parsedAmount})`);
      console.log(`   ✅ É NaN? ${isNaN(parsedAmount) ? 'SIM ❌' : 'NÃO ✅'}`);
    }

    // 2. Buscar despesas
    console.log('\n2. Testando despesas...');
    const expensesResponse = await fetchData(`${BASE_URL}/expenses`);
    const expenses = expensesResponse || [];
    console.log(`   ✅ ${expenses.length} despesas encontradas`);
    
    if (expenses.length > 0) {
      const firstExpense = expenses[0];
      console.log(`   📊 Primeira despesa: ${firstExpense.description} - R$ ${firstExpense.amount}`);
      const parsedAmount = parseAmount(firstExpense.amount);
      console.log(`   🔢 Valor parseado: ${parsedAmount} (tipo: ${typeof parsedAmount})`);
      console.log(`   ✅ É NaN? ${isNaN(parsedAmount) ? 'SIM ❌' : 'NÃO ✅'}`);
    }

    // 3. Buscar obrigações tributárias
    console.log('\n3. Testando obrigações tributárias...');
    const obligationsResponse = await fetchData(`${BASE_URL}/tax-obligations`);
    const obligations = obligationsResponse || [];
    console.log(`   ✅ ${obligations.length} obrigações encontradas`);
    
    if (obligations.length > 0) {
      const firstObligation = obligations[0];
      console.log(`   📊 Primeira obrigação: ${firstObligation.title} - R$ ${firstObligation.amount}`);
      const parsedAmount = parseAmount(firstObligation.amount);
      console.log(`   🔢 Valor parseado: ${parsedAmount} (tipo: ${typeof parsedAmount})`);
      console.log(`   ✅ É NaN? ${isNaN(parsedAmount) ? 'SIM ❌' : 'NÃO ✅'}`);
    }

    // 4. Simular cálculos do useFinancialCalculations
    console.log('\n4. Simulando cálculos financeiros...');
    
    const totalReceitas = incomes.reduce((total, income) => {
      const amount = parseAmount(income.amount);
      return total + amount;
    }, 0);
    
    const totalDespesas = expenses.reduce((total, expense) => {
      const amount = parseAmount(expense.amount);
      return total + amount;
    }, 0);
    
    const totalObrigacoes = obligations.reduce((total, obligation) => {
      const amount = parseAmount(obligation.amount);
      return total + amount;
    }, 0);
    
    const saldoLiquido = totalReceitas - totalDespesas - totalObrigacoes;
    
    console.log(`   💰 Total de Receitas: R$ ${totalReceitas.toFixed(2)}`);
    console.log(`   💸 Total de Despesas: R$ ${totalDespesas.toFixed(2)}`);
    console.log(`   📋 Total de Obrigações: R$ ${totalObrigacoes.toFixed(2)}`);
    console.log(`   💵 Saldo Líquido: R$ ${saldoLiquido.toFixed(2)}`);
    
    console.log(`   ✅ Algum valor é NaN? ${[totalReceitas, totalDespesas, totalObrigacoes, saldoLiquido].some(isNaN) ? 'SIM ❌' : 'NÃO ✅'}`);

    // 5. Buscar dados para formulários
    console.log('\n5. Testando dados para formulários...');
    
    const sourceResponse = await fetchData(`${BASE_URL}/income-sources`);
    const sources = sourceResponse || [];
    console.log(`   ✅ ${sources.length} fontes de receita disponíveis`);
    
    const categoriesResponse = await fetchData(`${BASE_URL}/expense-categories`);
    const categories = categoriesResponse || [];
    console.log(`   ✅ ${categories.length} categorias de despesa disponíveis`);

    console.log('\n🎉 Teste de validação do frontend concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testFrontendValidation();
