const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'teste123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Senha:', password);
  console.log('Hash:', hash);
  
  // Testar se o hash funciona
  const isValid = await bcrypt.compare(password, hash);
  console.log('Validação:', isValid);
}

hashPassword();
