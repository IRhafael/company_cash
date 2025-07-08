const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fixUserAuth() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '1234',
      database: 'company'
    });
    
    console.log('🔧 CORRIGINDO AUTENTICAÇÃO DO USUÁRIO\n');

    // 1. Verificar usuário atual
    console.log('1. 👤 Verificando usuário atual:');
    const [users] = await connection.execute(`
      SELECT id, email, name, password FROM users WHERE email = 'devrhafael@outlook.com'
    `);
    
    if (users.length === 0) {
      console.log('   ❌ Usuário não encontrado!');
      return;
    }

    const user = users[0];
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Nome: ${user.name}`);
    console.log(`   🔑 Hash da senha atual: ${user.password.substring(0, 20)}...`);

    // 2. Gerar nova senha hash
    console.log('\n2. 🔐 Gerando nova senha hash para "1234":');
    const newPasswordHash = await bcrypt.hash('1234', 10);
    console.log(`   🔑 Nova senha hash: ${newPasswordHash.substring(0, 20)}...`);

    // 3. Atualizar senha no banco
    console.log('\n3. 💾 Atualizando senha no banco:');
    await connection.execute(`
      UPDATE users SET password = ? WHERE email = 'devrhafael@outlook.com'
    `, [newPasswordHash]);
    
    console.log('   ✅ Senha atualizada com sucesso!');

    // 4. Verificar se a senha funciona
    console.log('\n4. 🧪 Testando nova senha:');
    const isValid = await bcrypt.compare('1234', newPasswordHash);
    console.log(`   🔍 Verificação da senha: ${isValid ? '✅ Válida' : '❌ Inválida'}`);

    // 5. Buscar usuário atualizado
    console.log('\n5. 📋 Usuário atualizado:');
    const [updatedUsers] = await connection.execute(`
      SELECT id, email, name, password FROM users WHERE email = 'devrhafael@outlook.com'
    `);
    
    const updatedUser = updatedUsers[0];
    console.log(`   📧 Email: ${updatedUser.email}`);
    console.log(`   👤 Nome: ${updatedUser.name}`);
    console.log(`   🆔 ID: ${updatedUser.id}`);
    console.log(`   🔑 Nova senha hash: ${updatedUser.password.substring(0, 20)}...`);

    console.log('\n✅ Correção concluída!');
    console.log('🔐 Credenciais para login:');
    console.log('   📧 Email: devrhafael@outlook.com');
    console.log('   🔑 Senha: 1234');
    
  } catch (error) {
    console.error('❌ Erro durante a correção:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixUserAuth();
