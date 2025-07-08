const bcrypt = require('bcryptjs');

async function generateUsers() {
  console.log('Gerando hashes de senhas para usuários...\n');
  
  const users = [
    { email: 'devrhafael@outlook.com', password: 'Viver321', name: 'Italo', company: 'Italo Contabilidade' },
    { email: 'demo@example.com', password: 'demo123', name: 'Demo', company: 'Demo Ltda' },
    { email: 'teste@example.com', password: 'teste123', name: 'Teste', company: 'Teste Corp' },
    { email: 'admin@company.com', password: 'admin123', name: 'Admin', company: 'Admin Corp' }
  ];
  
  console.log('-- Script SQL para inserir usuários\n');
  console.log('-- Limpar usuários existentes');
  for (const user of users) {
    console.log(`DELETE FROM users WHERE email = '${user.email}';`);
  }
  
  console.log('\n-- Inserir usuários com senhas hashadas');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    const userId = `user-${user.name.toLowerCase()}-${Date.now()}`;
    
    console.log(`-- Usuário: ${user.name} (${user.email}) - Senha: ${user.password}`);
    console.log(`INSERT INTO users (id, name, email, password, company_name, cnpj, business_type, created_at) VALUES`);
    console.log(`('${userId}', '${user.name}', '${user.email}', '${hash}', '${user.company}', '12.345.678/0001-90', 'Serviços', NOW());\n`);
  }
  
  console.log('-- Verificar usuários inseridos');
  console.log('SELECT email, name, company_name FROM users ORDER BY created_at DESC;');
}

generateUsers();
