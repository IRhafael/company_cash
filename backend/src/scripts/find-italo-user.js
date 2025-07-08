const mysql = require('mysql2/promise');

async function findItaloUser() {
  console.log('🔍 Procurando usuário italo...');
  
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company',
  });
  
  try {
    // Buscar usuários que podem ser o italo
    const [users] = await db.query('SELECT id, name, email FROM users WHERE email LIKE "%italo%" OR email LIKE "%devrhafael%" OR name LIKE "%italo%"');
    
    console.log('👥 Usuários encontrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log('');
    });
    
    if (users.length > 0) {
      const targetUser = users.find(user => user.email === 'devrhafael@outlook.com') || users[0];
      console.log(`🎯 Usuário alvo encontrado:`);
      console.log(`   ID: ${targetUser.id}`);
      console.log(`   Nome: ${targetUser.name}`);
      console.log(`   Email: ${targetUser.email}`);
      return targetUser.id;
    } else {
      console.log('❌ Nenhum usuário italo encontrado');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error.message);
    return null;
  } finally {
    await db.end();
  }
}

findItaloUser();
