const mysql = require('mysql2/promise');

async function fixIncomes() {
  console.log('🔧 Corrigindo inserção de receitas...');
  
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '1234',
    database: 'company',
  });
  
  try {
    const userId = 'user-italo-1751997790402';
    
    // Verificar se as fontes de receita existem
    console.log('🔍 Verificando fontes de receita...');
    const [sources] = await db.query('SELECT id, name FROM income_sources WHERE user_id = ?', [userId]);
    console.log(`   Fontes encontradas: ${sources.length}`);
    sources.forEach(source => console.log(`   - ${source.id}: ${source.name}`));
    
    // Verificar se já existem receitas
    console.log('\n🔍 Verificando receitas existentes...');
    const [existingIncomes] = await db.query('SELECT id, description, amount FROM incomes WHERE user_id = ?', [userId]);
    console.log(`   Receitas existentes: ${existingIncomes.length}`);
    
    if (existingIncomes.length > 0) {
      console.log('   Removendo receitas existentes...');
      await db.query('DELETE FROM incomes WHERE user_id = ?', [userId]);
    }
    
    // Inserir receitas novamente
    console.log('\n💰 Inserindo receitas...');
    const incomes = [
      { id: 'income-1-italo-fix', sourceId: 'source-consultoria-italo', description: 'Consultoria de TI - Cliente A', amount: 15000.00, date: '2025-01-05', client: 'Cliente A Ltda' },
      { id: 'income-2-italo-fix', sourceId: 'source-vendas-italo', description: 'Venda de Software - Licença Anual', amount: 8500.00, date: '2025-01-10', client: 'Software Corp' },
      { id: 'income-3-italo-fix', sourceId: 'source-treinamentos-italo', description: 'Treinamento Corporativo', amount: 4200.00, date: '2025-01-15', client: 'Empresa Educação' },
      { id: 'income-4-italo-fix', sourceId: 'source-manutencao-italo', description: 'Manutenção de Sistemas', amount: 3500.00, date: '2025-01-20', client: 'Sistema Tech' },
      { id: 'income-5-italo-fix', sourceId: 'source-consultoria-italo', description: 'Consultoria de TI - Cliente B', amount: 12000.00, date: '2025-02-02', client: 'Cliente B SA' },
      { id: 'income-6-italo-fix', sourceId: 'source-desenvolvimento-italo', description: 'Desenvolvimento de App Mobile', amount: 18000.00, date: '2025-02-10', client: 'Mobile Solutions' },
      { id: 'income-7-italo-fix', sourceId: 'source-suporte-italo', description: 'Suporte Técnico Premium', amount: 2800.00, date: '2025-02-15', client: 'Support Corp' },
      { id: 'income-8-italo-fix', sourceId: 'source-hospedagem-italo', description: 'Hospedagem de Sites', amount: 1500.00, date: '2025-03-01', client: 'Web Hosting' }
    ];
    
    for (const income of incomes) {
      try {
        // Verificar se a fonte existe
        const [sourceCheck] = await db.query('SELECT id FROM income_sources WHERE id = ? AND user_id = ?', [income.sourceId, userId]);
        
        if (sourceCheck.length === 0) {
          console.log(`   ❌ Fonte não encontrada: ${income.sourceId}`);
          continue;
        }
        
        await db.query(
          'INSERT INTO incomes (id, user_id, source_id, description, amount, date, payment_method, client_name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [income.id, userId, income.sourceId, income.description, income.amount, income.date, 'PIX', income.client, 'Receita de exemplo']
        );
        console.log(`   ✅ ${income.description} - R$ ${income.amount}`);
        
      } catch (error) {
        console.log(`   ❌ Erro ao inserir ${income.description}: ${error.message}`);
      }
    }
    
    // Verificação final
    console.log('\n📊 Verificação final...');
    const [finalIncomes] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM incomes WHERE user_id = ?', [userId]);
    const [finalExpenses] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM expenses WHERE user_id = ?', [userId]);
    const [finalObligations] = await db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM tax_obligations WHERE user_id = ?', [userId]);
    
    console.log(`💰 Receitas: ${finalIncomes[0].count} itens - R$ ${finalIncomes[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    console.log(`💸 Despesas: ${finalExpenses[0].count} itens - R$ ${finalExpenses[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    console.log(`📋 Obrigações: ${finalObligations[0].count} itens - R$ ${finalObligations[0].total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`);
    
    const result = (finalIncomes[0].total || 0) - (finalExpenses[0].total || 0) - (finalObligations[0].total || 0);
    console.log(`🎯 Resultado Líquido: R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    console.log('\n✅ Correção finalizada!');
    
  } catch (error) {
    console.error('❌ Erro durante a correção:', error.message);
  } finally {
    await db.end();
  }
}

fixIncomes();
