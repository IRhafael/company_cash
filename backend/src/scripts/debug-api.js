

async function debugApi() {
  console.log('🔍 Debug da API...');

  try {
    // 1. Login
    console.log('\n1️⃣ Fazendo login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'devrhafael@outlook.com',
        password: 'Viver321'
      })
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido!');
    console.log('Token:', loginData.token.substring(0, 50) + '...');
    console.log('User ID:', loginData.user.id);
    console.log('User Email:', loginData.user.email);

    const token = loginData.token;
    const userId = loginData.user.id;

    // 2. Testar receitas com debug
    console.log('\n2️⃣ Testando endpoint de receitas com debug...');
    const debugResponse = await fetch('http://localhost:3001/api/incomes?debug=true', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const debugData = await debugResponse.json();
    console.log('Status:', debugResponse.status);
    console.log('Debug data:', JSON.stringify(debugData, null, 2));

    // 3. Testar receitas normal
    console.log('\n3️⃣ Testando endpoint de receitas normal...');
    const incomesResponse = await fetch('http://localhost:3001/api/incomes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const incomesData = await incomesResponse.json();
    console.log('Status:', incomesResponse.status);
    console.log('Receitas retornadas:', incomesData.data?.length || 0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugApi();
