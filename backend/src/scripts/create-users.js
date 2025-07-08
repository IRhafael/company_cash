const mysql = require('mysql2/promise');

async function createUsers() {
  console.log('🔧 Criando usuários no banco de dados...');
  
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company',
  });
  
  try {
    // Limpar usuários existentes
    console.log('Limpando usuários existentes...');
    await db.query("DELETE FROM users WHERE email = 'devrhafael@outlook.com'");
    await db.query("DELETE FROM users WHERE email = 'demo@example.com'");
    await db.query("DELETE FROM users WHERE email = 'teste@example.com'");
    await db.query("DELETE FROM users WHERE email = 'admin@company.com'");
    
    // Inserir usuários
    console.log('Inserindo novos usuários...');
    
    const users = [
      {
        id: 'user-italo-1751997790402',
        name: 'Italo',
        email: 'devrhafael@outlook.com',
        password: '$2a$10$ucKfyHiqLn1cS66LCNGl/u2khNqt6Ce8fr6MwMtESonOlmMsOSBFa',
        company: 'Italo Contabilidade'
      },
      {
        id: 'user-demo-1751997790468',
        name: 'Demo',
        email: 'demo@example.com',
        password: '$2a$10$Iq7PQeuB/EtlY9/nN7Dc5ePPYITJg7Cc5FBmvmWhBq1JMXf4bctsO',
        company: 'Demo Ltda'
      },
      {
        id: 'user-teste-1751997790531',
        name: 'Teste',
        email: 'teste@example.com',
        password: '$2a$10$0jmcMh.h0JHqPrYt1ovhrus19YQfnu51.nSVc6OpDL16dbF72/nlC',
        company: 'Teste Corp'
      },
      {
        id: 'user-admin-1751997790596',
        name: 'Admin',
        email: 'admin@company.com',
        password: '$2a$10$s1frztGqLnPfTee3qaxzw.sRYFlRJnmVD1kNI8cKa0izUA6kVpQ4u',
        company: 'Admin Corp'
      }
    ];
    
    for (const user of users) {
      await db.query(
        `INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [user.id, user.name, user.email, user.password, user.company, '12.345.678/0001-90', 'Serviços']
      );
      console.log(`✅ Usuário criado: ${user.name} (${user.email})`);
    }
    
    // Verificar usuários criados
    const [rows] = await db.query('SELECT email, name, company_name FROM users ORDER BY created_at DESC');
    console.log('\n📊 Usuários no banco:');
    rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.email} - ${user.company_name}`);
    });
    
    console.log('\n✅ Usuários criados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error.message);
  } finally {
    await db.end();
  }
}

createUsers();
