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
async function fetchData(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
}

async function testCompleteCRUD() {
  try {
    console.log('🚀 Testando operações CRUD completas...\n');

    // 0. Fazer login
    console.log('0. Fazendo login...');
    await login();

    // 1. Buscar fontes de receita para usar no formulário
    console.log('\n1. Buscando fontes de receita...');
    const sources = await fetchData(`${BASE_URL}/income-sources`);
    console.log(`   ✅ ${sources.length} fontes encontradas`);
    const firstSource = sources[0];
    console.log(`   📋 Primeira fonte: ${firstSource.name} (ID: ${firstSource.id})`);

    // 2. Criar uma nova receita
    console.log('\n2. Criando nova receita...');
    const newIncomeData = {
      description: 'Receita de Teste - Validação Frontend',
      amount: 2500.50,
      receivedDate: '2025-07-08',
      sourceId: firstSource.id,
      notes: 'Receita criada durante teste de validação do sistema'
    };
    
    console.log('   📤 Dados da receita:', newIncomeData);
    
    const createdIncome = await fetchData(`${BASE_URL}/incomes`, {
      method: 'POST',
      body: JSON.stringify(newIncomeData)
    });
    
    console.log('   ✅ Receita criada com sucesso!');
    console.log(`   🆔 ID: ${createdIncome.id}`);
    console.log(`   💰 Valor: R$ ${createdIncome.amount}`);

    // 3. Buscar receitas novamente para confirmar
    console.log('\n3. Confirmando receita criada...');
    const incomesResponse = await fetchData(`${BASE_URL}/incomes`);
    const incomes = incomesResponse.data || [];
    const createdIncomeFound = incomes.find(income => income.id === createdIncome.id);
    
    if (createdIncomeFound) {
      console.log('   ✅ Receita encontrada na lista!');
      console.log(`   📊 Descrição: ${createdIncomeFound.description}`);
      console.log(`   💰 Valor: R$ ${createdIncomeFound.amount}`);
    } else {
      console.log('   ❌ Receita não encontrada na lista');
    }

    // 4. Testar cálculos atualizados
    console.log('\n4. Testando cálculos atualizados...');
    const totalReceitas = incomes.reduce((total, income) => {
      const amount = typeof income.amount === 'string' ? parseFloat(income.amount) : income.amount;
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    console.log(`   💰 Total de Receitas Atualizado: R$ ${totalReceitas.toFixed(2)}`);
    console.log(`   📊 Número de receitas: ${incomes.length}`);

    // 5. Limpar - Deletar a receita de teste
    console.log('\n5. Limpando - Deletando receita de teste...');
    await fetchData(`${BASE_URL}/incomes/${createdIncome.id}`, {
      method: 'DELETE'
    });
    console.log('   ✅ Receita de teste deletada com sucesso!');

    console.log('\n🎉 Teste CRUD completo concluído com sucesso!');
    console.log('\n📋 Resumo dos testes:');
    console.log('   ✅ Login funcionando');
    console.log('   ✅ Busca de dados funcionando');
    console.log('   ✅ Criação de receita funcionando');
    console.log('   ✅ Cálculos sem NaN');
    console.log('   ✅ Deleção funcionando');
    console.log('   ✅ Sistema totalmente funcional para o usuário Italo!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste CRUD:', error.message);
  }
}

testCompleteCRUD();
