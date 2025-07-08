const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Caminho para o banco de dados
const dbPath = '../database.sqlite';

async function checkAndCreateUser() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    console.log('🔍 Verificando usuário no banco...');
    
    // Verificar se o usuário existe
    db.get('SELECT * FROM users WHERE email = ?', ['devrhafael@outlook.com'], async (err, user) => {
      if (err) {
        console.error('❌ Erro ao verificar usuário:', err);
        db.close();
        reject(err);
        return;
      }
      
      if (user) {
        console.log('✅ Usuário encontrado:', user.email);
        console.log(`   ID: ${user.id}`);
        console.log(`   Nome: ${user.name}`);
        console.log(`   Data criação: ${user.created_at}`);
        db.close();
        resolve(user);
      } else {
        console.log('⚠️ Usuário não encontrado. Criando novo usuário...');
        
        try {
          // Criar hash da senha
          const hashedPassword = await bcrypt.hash('senha123', 10);
          
          // Inserir novo usuário
          db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            ['Italo Developer', 'devrhafael@outlook.com', hashedPassword],
            function(err) {
              if (err) {
                console.error('❌ Erro ao criar usuário:', err);
                db.close();
                reject(err);
                return;
              }
              
              console.log('✅ Usuário criado com sucesso!');
              console.log(`   ID: ${this.lastID}`);
              console.log(`   Email: devrhafael@outlook.com`);
              console.log(`   Senha: senha123`);
              
              db.close();
              resolve({ id: this.lastID, email: 'devrhafael@outlook.com' });
            }
          );
        } catch (hashError) {
          console.error('❌ Erro ao gerar hash da senha:', hashError);
          db.close();
          reject(hashError);
        }
      }
    });
  });
}

// Verificar todos os usuários
function listAllUsers() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    db.all('SELECT * FROM users', (err, users) => {
      if (err) {
        console.error('❌ Erro ao listar usuários:', err);
        db.close();
        reject(err);
        return;
      }
      
      console.log('\n📋 Todos os usuários no banco:');
      if (users.length === 0) {
        console.log('   Nenhum usuário encontrado.');
      } else {
        users.forEach(user => {
          console.log(`   - ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}`);
        });
      }
      
      db.close();
      resolve(users);
    });
  });
}

async function main() {
  try {
    await listAllUsers();
    await checkAndCreateUser();
    console.log('\n✅ Verificação concluída!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

main();
