const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function checkAndCreateUser() {
  let connection;
  
  try {
    // Conectar ao banco MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🔍 Verificando usuário no banco MySQL...');
    
    // Verificar se o usuário existe
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['devrhafael@outlook.com']
    );
    
    if (users.length > 0) {
      const user = users[0];
      console.log('✅ Usuário encontrado:', user.email);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Data criação: ${user.created_at}`);
    } else {
      console.log('⚠️ Usuário não encontrado. Criando novo usuário...');
      
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      // Inserir novo usuário
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Italo Developer', 'devrhafael@outlook.com', hashedPassword]
      );
      
      console.log('✅ Usuário criado com sucesso!');
      console.log(`   ID: ${result.insertId}`);
      console.log(`   Email: devrhafael@outlook.com`);
      console.log(`   Senha: senha123`);
    }
    
    // Listar todos os usuários
    console.log('\n📋 Todos os usuários no banco:');
    const [allUsers] = await connection.execute('SELECT id, name, email, created_at FROM users');
    
    if (allUsers.length === 0) {
      console.log('   Nenhum usuário encontrado.');
    } else {
      allUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}`);
      });
    }
    
    console.log('\n✅ Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAndCreateUser();
