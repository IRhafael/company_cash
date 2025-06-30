"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const uuid_1 = require("uuid");
async function seedDatabase() {
    const db = await (0, sqlite_1.open)({
        filename: './database.sqlite',
        driver: sqlite3_1.default.Database
    });
    try {
        console.log('Populando base de dados com fontes e categorias padrão...');
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
        for (const source of defaultIncomeSources) {
            await db.run(`INSERT OR IGNORE INTO income_sources (id, user_id, name, type, color, is_active) 
         VALUES (?, 'default', ?, ?, ?, 1)`, [(0, uuid_1.v4)(), source.name, source.type, source.color]);
        }
        for (const category of defaultExpenseCategories) {
            await db.run(`INSERT OR IGNORE INTO expense_categories (id, user_id, name, type, color, icon, is_default) 
         VALUES (?, 'default', ?, ?, ?, ?, 1)`, [(0, uuid_1.v4)(), category.name, category.type, category.color, category.icon]);
        }
        console.log('✅ Base de dados populada com sucesso!');
        console.log(`📊 Inseridas ${defaultIncomeSources.length} fontes de receita padrão`);
        console.log(`📈 Inseridas ${defaultExpenseCategories.length} categorias de despesa padrão`);
    }
    catch (error) {
        console.error('❌ Erro ao popular base de dados:', error);
    }
    finally {
        await db.close();
    }
}
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map