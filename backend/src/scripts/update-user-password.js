const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updateUserPassword() {
  let connection;
  
  try {
    // Conectar ao banco MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🔧 Atualizando senha do usuário...');
    
    // Criar hash da nova senha
    const newPassword = 'senha123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha do usuário
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'devrhafael@outlook.com']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Senha atualizada com sucesso!');
      console.log(`   Email: devrhafael@outlook.com`);
      console.log(`   Nova senha: ${newPassword}`);
      
      // Testar login via API
      console.log('\n🌐 Testando login via API...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'devrhafael@outlook.com',
          password: newPassword
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login via API bem-sucedido!');
        console.log(`   Token: ${data.token.substring(0, 50)}...`);
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   User Name: ${data.user.name}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Login via API falhou (${response.status}): ${errorText}`);
      }
      
    } else {
      console.log('❌ Nenhum usuário foi atualizado');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateUserPassword();
