const mysql = require('mysql2/promise');

async function checkDatabase() {
  console.log('🔍 Verificando dados no banco...');
  
  // Configuração da conexão
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company'
  });

  try {
    // 1. Verificar usuário italo
    console.log('\n1️⃣ Verificando usuário Italo...');
    const [users] = await connection.query(
      'SELECT id, email, name FROM users WHERE email = ?',
      ['devrhafael@outlook.com']
    );
    console.log('   Usuário encontrado:', users[0]);
    const userId = users[0]?.id;

    if (!userId) {
      console.log('❌ Usuário não encontrado!');
      return;
    }

    // 2. Verificar fontes de receita
    console.log('\n2️⃣ Verificando fontes de receita...');
    const [sources] = await connection.query(
      'SELECT id, name, type FROM income_sources WHERE user_id = ?',
      [userId]
    );
    console.log(`   Fontes encontradas: ${sources.length}`);
    sources.forEach((source, i) => {
      console.log(`   ${i + 1}. ${source.id}: ${source.name} (${source.type})`);
    });

    // 3. Verificar receitas
    console.log('\n3️⃣ Verificando receitas...');
    const [incomes] = await connection.query(
      'SELECT id, user_id, source_id, description, amount, date FROM incomes WHERE user_id = ?',
      [userId]
    );
    console.log(`   Receitas encontradas: ${incomes.length}`);
    incomes.forEach((income, i) => {
      console.log(`   ${i + 1}. ${income.description} - R$ ${income.amount} (${income.date}) - Source: ${income.source_id}`);
    });

    // 4. Verificar se receitas têm sourceId válido
    console.log('\n4️⃣ Verificando relação receitas <-> fontes...');
    const [joinCheck] = await connection.query(`
      SELECT i.id, i.description, i.amount, i.source_id, s.name as source_name
      FROM incomes i
      LEFT JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ?
    `, [userId]);
    
    console.log(`   Receitas com fontes válidas: ${joinCheck.length}`);
    joinCheck.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.description} - ${item.source_name || 'FONTE INVÁLIDA'}`);
    });

    // 5. Testar query do endpoint
    console.log('\n5️⃣ Testando query do endpoint...');
    const [endpointResult] = await connection.query(`
      SELECT i.*, s.name as source_name, s.type as source_type, s.color as source_color
      FROM incomes i
      INNER JOIN income_sources s ON i.source_id = s.id
      WHERE i.user_id = ?
      ORDER BY i.date DESC, i.created_at DESC
      LIMIT 50 OFFSET 0
    `, [userId]);
    
    console.log(`   Resultado da query do endpoint: ${endpointResult.length} receitas`);
    endpointResult.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.description} - R$ ${item.amount} - ${item.source_name}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await connection.end();
  }
}

checkDatabase();
