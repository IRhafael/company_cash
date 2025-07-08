// Teste simples de API sem axios para debugging
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

async function testBackend() {
  console.log('🔍 Testando backend...');
  
  try {
    // Teste 1: Health check
    console.log('\n1. Testando health check...');
    const healthResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    
    console.log(`Status: ${healthResult.status}`);
    console.log(`Resposta: ${JSON.stringify(healthResult.data)}`);
    
    if (healthResult.status !== 200) {
      console.log('❌ Backend não está respondendo corretamente');
      return;
    }
    
    console.log('✅ Backend está online!');
    
    // Teste 2: Login
    console.log('\n2. Testando login...');
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
    
    console.log(`Status: ${loginResult.status}`);
    console.log(`Resposta: ${JSON.stringify(loginResult.data)}`);
    
    if (loginResult.status !== 200) {
      console.log('❌ Falha no login');
      return;
    }
    
    const token = loginResult.data.token;
    console.log('✅ Login realizado com sucesso!');
    
    // Teste 3: Listar obrigações tributárias
    console.log('\n3. Testando listagem de obrigações tributárias...');
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
    console.log(`Obrigações encontradas: ${obligationsResult.data?.length || 0}`);
    
    if (obligationsResult.data && obligationsResult.data.length > 0) {
      obligationsResult.data.forEach((obligation, index) => {
        console.log(`  ${index + 1}. ${obligation.name} - R$ ${obligation.amount} (${obligation.status})`);
      });
    }
    
    // Teste 4: Inserir nova obrigação (se não houver nenhuma)
    if (!obligationsResult.data || obligationsResult.data.length === 0) {
      console.log('\n4. Inserindo obrigação de teste...');
      const newObligation = {
        name: 'IRPJ - Janeiro 2025',
        description: 'Imposto de Renda Pessoa Jurídica',
        type: 'IRPJ',
        dueDate: '2025-01-31',
        amount: 2500.00,
        status: 'pendente',
        frequency: 'mensal',
        referenceMonth: '2025-01',
        notes: 'Teste de inserção via API',
        taxType: 'IRPJ'
      };
      
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
      
      console.log(`Status inserção: ${insertResult.status}`);
      console.log(`Resposta: ${JSON.stringify(insertResult.data)}`);
      
      if (insertResult.status === 201) {
        console.log('✅ Obrigação inserida com sucesso!');
      } else {
        console.log('❌ Falha ao inserir obrigação');
      }
    }
    
    console.log('\n🎉 Teste completo finalizado!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Backend não está rodando na porta 3001');
    }
  }
}

testBackend();
