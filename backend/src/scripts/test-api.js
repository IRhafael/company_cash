const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testando conexão com o backend...');
    
    // Testar endpoint de saúde
    try {
      const healthResponse = await axios.get('http://localhost:3000/api/health');
      console.log('✓ Backend está online!');
    } catch (error) {
      console.log('✗ Backend não está respondendo no port 3000');
      return;
    }

    // Testar login
    console.log('Testando login...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'devrhafael@outlook.com',
      password: 'Viver321'
    });

    console.log('✓ Login realizado com sucesso!');
    console.log('Token recebido:', loginResponse.data.token.substring(0, 20) + '...');

    // Testar listagem de obrigações existentes
    const token = loginResponse.data.token;
    const obligationsResponse = await axios.get('http://localhost:3000/api/tax-obligations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`✓ Obrigações existentes: ${obligationsResponse.data.length}`);
    obligationsResponse.data.forEach(obligation => {
      console.log(`  - ${obligation.name}`);
    });

  } catch (error) {
    console.error('Erro no teste:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Backend não está rodando em http://localhost:3000');
    }
  }
}

testAPI();
