const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testLogin() {
  let connection;
  
  try {
    // Conectar ao banco MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🔍 Testando login...');
    
    // Buscar usuário
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['devrhafael@outlook.com']
    );
    
    if (users.length === 0) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    const user = users[0];
    console.log(`✅ Usuário encontrado: ${user.email}`);
    
    // Testar várias senhas possíveis
    const possiblePasswords = ['senha123', '123456', 'admin', 'italo', '1234'];
    
    for (const password of possiblePasswords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`   Senha "${password}": ${isValid ? '✅ VÁLIDA' : '❌ Inválida'}`);
      
      if (isValid) {
        console.log(`\n🎉 Senha correta encontrada: "${password}"`);
        break;
      }
    }
    
    // Tentar fazer login via API
    console.log('\n🌐 Testando login via API...');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'devrhafael@outlook.com',
        password: 'senha123'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login via API bem-sucedido!');
      console.log(`   Token: ${data.token.substring(0, 50)}...`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Login via API falhou (${response.status}): ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testLogin();
