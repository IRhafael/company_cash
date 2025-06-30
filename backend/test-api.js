const http = require('http');
const fs = require('fs');

// Função para fazer requisições HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testAPI() {
  console.log('Testando API do backend...\n');

  try {
    // 1. Teste Health Check
    console.log('1. Testando Health Check...');
    const healthOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    };
    
    const healthResponse = await makeRequest(healthOptions);
    console.log('Health Check Response:', healthResponse);
    console.log('');

    // 2. Teste Registro de Usuário
    console.log('2. Testando Registro de Usuário...');
    const userData = fs.readFileSync('./test-user.json', 'utf8');
    
    const registerOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userData)
      }
    };
    
    const registerResponse = await makeRequest(registerOptions, userData);
    console.log('Register Response:', registerResponse);
    console.log('');

    // 3. Teste Login
    if (registerResponse.status === 201 || registerResponse.status === 409) {
      console.log('3. Testando Login...');
      const loginData = JSON.stringify({
        email: 'teste@teste.com',
        password: '123456'
      });
      
      const loginOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }
      };
      
      const loginResponse = await makeRequest(loginOptions, loginData);
      console.log('Login Response:', loginResponse);
      
      if (loginResponse.data && loginResponse.data.token) {
        console.log('Token obtido com sucesso!');
        
        // 4. Teste endpoint protegido (sources)
        console.log('\n4. Testando endpoint protegido (sources)...');
        const sourcesOptions = {
          hostname: 'localhost',
          port: 3001,
          path: '/api/income-sources',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`
          }
        };
        
        const sourcesResponse = await makeRequest(sourcesOptions);
        console.log('Sources Response:', sourcesResponse);
      }
    }

  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar teste imediatamente
console.log('=== TESTE DA API BACKEND ===\n');
testAPI().then(() => {
  console.log('\n=== TESTE CONCLUÍDO ===');
}).catch(err => {
  console.error('Erro no teste:', err);
});
