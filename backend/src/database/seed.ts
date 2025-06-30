import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

async function seedDatabase() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'italo',
    password: '', // Adapte se necessário
    database: 'company',
  });

  try {
    console.log('Populando base de dados com fontes e categorias padrão...');

    // Fontes de receita padrão para escritórios de contabilidade
    const defaultIncomeSources = [
      { name: 'Honorários Contábeis', type: 'service', color: '#3B82F6' },
      { name: 'Consultoria Tributária', type: 'service', color: '#10B981' },
      { name: 'Auditoria', type: 'service', color: '#8B5CF6' },
      { name: 'Perícia Contábil', type: 'service', color: '#F59E0B' },
      { name: 'Assessoria Empresarial', type: 'service', color: '#EF4444' },
      { name: 'Terceirização Contábil', type: 'service', color: '#6366F1' },
      { name: 'Gestão Financeira', type: 'service', color: '#EC4899' },
      { name: 'Abertura de Empresas', type: 'service', color: '#14B8A6' },
    ];

    // Categorias de despesa padrão para escritórios de contabilidade
    const defaultExpenseCategories = [
      { name: 'Folha de Pagamento', type: 'operational', color: '#DC2626', icon: 'Users' },
      { name: 'Aluguel', type: 'fixed', color: '#7C3AED', icon: 'Building' },
      { name: 'Software e Licenças', type: 'operational', color: '#2563EB', icon: 'Monitor' },
      { name: 'Material de Escritório', type: 'operational', color: '#059669', icon: 'FileText' },
      { name: 'Energia Elétrica', type: 'fixed', color: '#D97706', icon: 'Zap' },
      { name: 'Internet e Telefonia', type: 'fixed', color: '#7C2D12', icon: 'Phone' },
      { name: 'Marketing', type: 'variable', color: '#BE185D', icon: 'Megaphone' },
      { name: 'Capacitação e Treinamento', type: 'variable', color: '#0891B2', icon: 'GraduationCap' },
      { name: 'Manutenção', type: 'variable', color: '#65A30D', icon: 'Wrench' },
      { name: 'Impostos e Taxas', type: 'tax', color: '#991B1B', icon: 'Receipt' },
    ];

    // Inserir fontes de receita padrão (sem usuário específico - será usado como template)
    for (const source of defaultIncomeSources) {
      await db.query(
        `INSERT IGNORE INTO income_sources (id, user_id, name, type, color, is_active) 
         VALUES (?, 'default', ?, ?, ?, 1)`,
        [uuidv4(), source.name, source.type, source.color]
      );
    }

    // Inserir categorias de despesa padrão (sem usuário específico - será usado como template)
    for (const category of defaultExpenseCategories) {
      await db.query(
        `INSERT IGNORE INTO expense_categories (id, user_id, name, type, color, icon, is_default) 
         VALUES (?, 'default', ?, ?, ?, ?, 1)`,
        [uuidv4(), category.name, category.type, category.color, category.icon]
      );
    }

    console.log('✅ Base de dados populada com sucesso!');
    console.log(`📊 Inseridas ${defaultIncomeSources.length} fontes de receita padrão`);
    console.log(`📈 Inseridas ${defaultExpenseCategories.length} categorias de despesa padrão`);

  } catch (error) {
    console.error('❌ Erro ao popular base de dados:', error);
  } finally {
    await db.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };

