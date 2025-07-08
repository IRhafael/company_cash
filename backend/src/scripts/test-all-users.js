// Script para verificar usuários existentes e testar diferentes credenciais
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
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

async function testUsers() {
  console.log('🔍 Testando diferentes usuários...');
  
  const usersToTest = [
    { email: 'devrhafael@outlook.com', password: 'Viver321', name: 'italo' },
    { email: 'demo@example.com', password: 'demo123', name: 'demo' },
    { email: 'teste@example.com', password: 'teste123', name: 'teste' },
    { email: 'admin@company.com', password: 'admin123', name: 'admin' }
  ];
  
  for (const user of usersToTest) {
    console.log(`\n🧪 Testando usuário: ${user.name} (${user.email})`);
    
    try {
      const loginResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
        email: user.email,
        password: user.password
      });
      
      if (loginResult.status === 200) {
        console.log(`✅ Login bem-sucedido para ${user.name}!`);
        
        const token = loginResult.data.token;
        
        // Testar listagem de obrigações para este usuário
        const obligationsResult = await makeRequest({
          hostname: 'localhost',
          port: 3001,
          path: '/api/tax-obligations',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`   📊 Obrigações encontradas: ${obligationsResult.data?.length || 0}`);
        
        if (obligationsResult.data && obligationsResult.data.length > 0) {
          obligationsResult.data.forEach((obligation, index) => {
            console.log(`   ${index + 1}. ${obligation.name} - R$ ${obligation.amount}`);
          });
        }
        
        // Testar listagem de receitas
        const incomesResult = await makeRequest({
          hostname: 'localhost',
          port: 3001,
          path: '/api/incomes',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`   💰 Receitas encontradas: ${incomesResult.data?.length || 0}`);
        
        // Testar listagem de despesas
        const expensesResult = await makeRequest({
          hostname: 'localhost',
          port: 3001,
          path: '/api/expenses',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`   💸 Despesas encontradas: ${expensesResult.data?.length || 0}`);
        
        return { user, token }; // Retorna o primeiro usuário que fez login com sucesso
        
      } else {
        console.log(`❌ Falha no login para ${user.name}: ${loginResult.data?.error || 'Erro desconhecido'}`);
      }
      
    } catch (error) {
      console.log(`❌ Erro ao testar ${user.name}: ${error.message}`);
    }
  }
  
  return null;
}

async function insertTestObligation(token) {
  console.log('\n📝 Inserindo obrigação de teste...');
  
  const newObligation = {
    title: 'IRPJ - Janeiro 2025',  // title em vez de name
    description: 'Imposto de Renda Pessoa Jurídica - Teste',
    category: 'IRPJ',  // category em vez de type
    dueDate: '2025-01-31',
    amount: 2500.00,
    status: 'pendente',
    priority: 'alta',  // campo obrigatório que estava faltando
    frequency: 'mensal',
    referenceMonth: '2025-01',
    notes: 'Obrigação inserida via teste de API',
    taxType: 'IRPJ'
  };
  
  try {
    const insertResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/tax-obligations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, newObligation);
    
    if (insertResult.status === 201) {
      console.log('✅ Obrigação inserida com sucesso!');
      console.log(`   ID: ${insertResult.data.id}`);
      return insertResult.data;
    } else {
      console.log(`❌ Falha ao inserir obrigação: ${insertResult.data?.error || 'Erro desconhecido'}`);
      console.log(`   Status: ${insertResult.status}`);
      console.log(`   Resposta: ${JSON.stringify(insertResult.data)}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao inserir obrigação: ${error.message}`);
  }
  
  return null;
}

async function runFullTest() {
  const userWithToken = await testUsers();
  
  if (userWithToken) {
    console.log(`\n🎯 Usando usuário ${userWithToken.user.name} para testes adicionais...`);
    await insertTestObligation(userWithToken.token);
  } else {
    console.log('\n❌ Nenhum usuário conseguiu fazer login. Verificar credenciais no banco de dados.');
  }
  
  console.log('\n🏁 Teste completo finalizado!');
}

runFullTest();
