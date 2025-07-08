// Script simplificado para inserir dados de forma mais robusta
const http = require('http');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    req.setTimeout(10000); // timeout de 10 segundos
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

async function testConnection() {
  console.log('🔍 Testando conexão...');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    
    if (result.status === 200) {
      console.log('✅ Backend está online!');
      return true;
    }
  } catch (error) {
    console.log(`❌ Erro de conexão: ${error.message}`);
  }
  return false;
}

async function login() {
  console.log('🔐 Fazendo login...');
  
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
  
  if (loginResult.status === 200) {
    console.log('✅ Login realizado com sucesso!');
    return loginResult.data.token;
  } else {
    throw new Error(`Falha no login: ${loginResult.data?.error || 'Erro desconhecido'}`);
  }
}

async function insertSampleData(token) {
  console.log('\n📝 Inserindo dados de amostra...');
  
  // Inserir algumas receitas
  const sampleIncomes = [
    { description: 'Consultoria Janeiro', amount: 15000, date: '2025-01-15', source: 'Consultoria', category: 'Serviços' },
    { description: 'Venda Software', amount: 8500, date: '2025-01-20', source: 'Vendas', category: 'Produtos' },
    { description: 'Treinamento', amount: 4200, date: '2025-02-05', source: 'Treinamentos', category: 'Educação' }
  ];
  
  for (const income of sampleIncomes) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/incomes',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, income);
      
      if (result.status === 201) {
        console.log(`✅ Receita: ${income.description} - R$ ${income.amount}`);
      } else {
        console.log(`❌ Erro receita: ${income.description} - Status: ${result.status}`);
      }
      
      await sleep(500); // pausa entre requisições
      
    } catch (error) {
      console.log(`❌ Erro receita ${income.description}: ${error.message}`);
    }
  }
  
  // Inserir algumas despesas
  const sampleExpenses = [
    { description: 'Aluguel Escritório', amount: 2500, date: '2025-01-05', category: 'Aluguel' },
    { description: 'Energia Elétrica', amount: 450, date: '2025-01-08', category: 'Utilidades' },
    { description: 'Internet', amount: 320, date: '2025-01-10', category: 'Telecomunicações' }
  ];
  
  for (const expense of sampleExpenses) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/expenses',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, expense);
      
      if (result.status === 201) {
        console.log(`✅ Despesa: ${expense.description} - R$ ${expense.amount}`);
      } else {
        console.log(`❌ Erro despesa: ${expense.description} - Status: ${result.status}`);
      }
      
      await sleep(500);
      
    } catch (error) {
      console.log(`❌ Erro despesa ${expense.description}: ${error.message}`);
    }
  }
  
  // Inserir algumas obrigações
  const sampleObligations = [
    { title: 'IRPJ Janeiro', description: 'Imposto de Renda', category: 'IRPJ', dueDate: '2025-01-31', amount: 2800, status: 'pago', priority: 'alta' },
    { title: 'ISS Janeiro', description: 'Imposto sobre Serviços', category: 'ISS', dueDate: '2025-02-10', amount: 680, status: 'pago', priority: 'media' },
    { title: 'IRPJ Fevereiro', description: 'Imposto de Renda', category: 'IRPJ', dueDate: '2025-02-28', amount: 3200, status: 'pendente', priority: 'alta' }
  ];
  
  for (const obligation of sampleObligations) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/tax-obligations',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, obligation);
      
      if (result.status === 201) {
        console.log(`✅ Obrigação: ${obligation.title} - R$ ${obligation.amount} (${obligation.status})`);
      } else {
        console.log(`❌ Erro obrigação: ${obligation.title} - Status: ${result.status}`);
      }
      
      await sleep(500);
      
    } catch (error) {
      console.log(`❌ Erro obrigação ${obligation.title}: ${error.message}`);
    }
  }
}

async function getSummary(token) {
  console.log('\n📊 Resumo final:');
  
  try {
    const [incomesResult, expensesResult, obligationsResult] = await Promise.all([
      makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/incomes',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/expenses',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/tax-obligations',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);
    
    const totalIncomes = incomesResult.data?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    const totalExpenses = expensesResult.data?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    const totalObligations = obligationsResult.data?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
    
    console.log(`💰 Receitas: ${incomesResult.data?.length || 0} itens - R$ ${totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`💸 Despesas: ${expensesResult.data?.length || 0} itens - R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`📋 Obrigações: ${obligationsResult.data?.length || 0} itens - R$ ${totalObligations.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    const result = totalIncomes - totalExpenses - totalObligations;
    console.log(`🎯 Resultado: R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
  } catch (error) {
    console.log(`❌ Erro no resumo: ${error.message}`);
  }
}

async function main() {
  try {
    const isOnline = await testConnection();
    if (!isOnline) {
      console.log('❌ Backend não está acessível. Verifique se está rodando na porta 3001.');
      return;
    }
    
    const token = await login();
    await insertSampleData(token);
    await getSummary(token);
    
    console.log('\n🎉 Dados inseridos com sucesso!');
    console.log('🌐 Acesse http://localhost:5173 para visualizar os gráficos!');
    
  } catch (error) {
    console.error('❌ Erro principal:', error.message);
  }
}

main();
