// Script para testar se a API está retornando os dados corretamente
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000);
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🔍 Testando API com usuário italo...');
  
  try {
    // 1. Fazer login
    console.log('\n1️⃣ Fazendo login...');
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'devrhafael@outlook.com',
      password: 'Viver321'
    });
    
    if (loginResult.status !== 200) {
      console.log('❌ Falha no login:', loginResult.data);
      return;
    }
    
    console.log('✅ Login realizado com sucesso!');
    const token = loginResult.data.token;
    
    // 2. Testar endpoint de receitas
    console.log('\n2️⃣ Testando endpoint de receitas...');
    const incomesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/incomes',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${incomesResult.status}`);
    if (incomesResult.status === 200) {
      console.log(`✅ Receitas encontradas: ${incomesResult.data?.length || 0}`);
      if (incomesResult.data && incomesResult.data.length > 0) {
        console.log('   Primeiras 3 receitas:');
        incomesResult.data.slice(0, 3).forEach((income, index) => {
          console.log(`   ${index + 1}. ${income.description} - R$ ${income.amount} (${income.date})`);
        });
        
        const total = incomesResult.data.reduce((sum, income) => sum + parseFloat(income.amount), 0);
        console.log(`   💰 Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }
    } else {
      console.log('❌ Erro ao buscar receitas:', incomesResult.data);
    }
    
    // 3. Testar endpoint de despesas
    console.log('\n3️⃣ Testando endpoint de despesas...');
    const expensesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/expenses',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${expensesResult.status}`);
    if (expensesResult.status === 200) {
      console.log(`✅ Despesas encontradas: ${expensesResult.data?.length || 0}`);
      if (expensesResult.data && expensesResult.data.length > 0) {
        console.log('   Primeiras 3 despesas:');
        expensesResult.data.slice(0, 3).forEach((expense, index) => {
          console.log(`   ${index + 1}. ${expense.description} - R$ ${expense.amount} (${expense.date})`);
        });
        
        const total = expensesResult.data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        console.log(`   💸 Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }
    } else {
      console.log('❌ Erro ao buscar despesas:', expensesResult.data);
    }
    
    // 4. Testar endpoint de obrigações
    console.log('\n4️⃣ Testando endpoint de obrigações...');
    const obligationsResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/tax-obligations',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${obligationsResult.status}`);
    if (obligationsResult.status === 200) {
      console.log(`✅ Obrigações encontradas: ${obligationsResult.data?.length || 0}`);
      if (obligationsResult.data && obligationsResult.data.length > 0) {
        console.log('   Primeiras 3 obrigações:');
        obligationsResult.data.slice(0, 3).forEach((obligation, index) => {
          console.log(`   ${index + 1}. ${obligation.title} - R$ ${obligation.amount} (${obligation.status})`);
        });
        
        const total = obligationsResult.data.reduce((sum, obligation) => sum + parseFloat(obligation.amount), 0);
        console.log(`   📋 Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      }
    } else {
      console.log('❌ Erro ao buscar obrigações:', obligationsResult.data);
    }
    
    // 5. Testar endpoint de fontes de receita
    console.log('\n5️⃣ Testando endpoint de fontes de receita...');
    const sourcesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/income-sources',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${sourcesResult.status}`);
    if (sourcesResult.status === 200) {
      console.log(`✅ Fontes encontradas: ${sourcesResult.data?.length || 0}`);
      if (sourcesResult.data && sourcesResult.data.length > 0) {
        sourcesResult.data.forEach((source, index) => {
          console.log(`   ${index + 1}. ${source.name} (${source.type})`);
        });
      }
    } else {
      console.log('❌ Erro ao buscar fontes:', sourcesResult.data);
    }
    
    // 6. Testar endpoint de categorias de despesa
    console.log('\n6️⃣ Testando endpoint de categorias de despesa...');
    const categoriesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/expense-categories',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${categoriesResult.status}`);
    if (categoriesResult.status === 200) {
      console.log(`✅ Categorias encontradas: ${categoriesResult.data?.length || 0}`);
      if (categoriesResult.data && categoriesResult.data.length > 0) {
        categoriesResult.data.forEach((category, index) => {
          console.log(`   ${index + 1}. ${category.name}`);
        });
      }
    } else {
      console.log('❌ Erro ao buscar categorias:', categoriesResult.data);
    }
    
    console.log('\n🎯 Resumo do teste:');
    console.log(`   Login: ${loginResult.status === 200 ? '✅' : '❌'}`);
    console.log(`   Receitas: ${incomesResult.status === 200 ? '✅' : '❌'} (${incomesResult.data?.length || 0} itens)`);
    console.log(`   Despesas: ${expensesResult.status === 200 ? '✅' : '❌'} (${expensesResult.data?.length || 0} itens)`);
    console.log(`   Obrigações: ${obligationsResult.status === 200 ? '✅' : '❌'} (${obligationsResult.data?.length || 0} itens)`);
    console.log(`   Fontes: ${sourcesResult.status === 200 ? '✅' : '❌'} (${sourcesResult.data?.length || 0} itens)`);
    console.log(`   Categorias: ${categoriesResult.status === 200 ? '✅' : '❌'} (${categoriesResult.data?.length || 0} itens)`);
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testAPI();
