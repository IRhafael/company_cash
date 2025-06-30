"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
async function populateDefaultData() {
    const dbPath = path_1.default.join(__dirname, '../../database.sqlite');
    console.log('Conectando ao banco de dados:', dbPath);
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
    try {
        console.log('Populando dados padrão...');
        await db.run('DELETE FROM income_sources WHERE user_id = "default"');
        await db.run('DELETE FROM expense_categories WHERE user_id = "default"');
        const incomeSources = [
            { name: 'Honorários Contábeis', type: 'servico', color: '#22c55e', account_code: '3.1.01' },
            { name: 'Consultoria Empresarial', type: 'servico', color: '#3b82f6', account_code: '3.1.02' },
            { name: 'Auditoria', type: 'servico', color: '#8b5cf6', account_code: '3.1.03' },
            { name: 'Abertura de Empresas', type: 'servico', color: '#f59e0b', account_code: '3.1.04' },
            { name: 'Consultoria Tributária', type: 'servico', color: '#ef4444', account_code: '3.1.05' },
            { name: 'Perícia Contábil', type: 'servico', color: '#06b6d4', account_code: '3.1.06' },
            { name: 'Assessoria Fiscal', type: 'servico', color: '#84cc16', account_code: '3.1.07' },
            { name: 'Cursos e Treinamentos', type: 'produto', color: '#f97316', account_code: '3.1.08' }
        ];
        const expenseCategories = [
            { name: 'Aluguel', color: '#dc2626', account_code: '4.1.01' },
            { name: 'Salários', color: '#059669', account_code: '4.1.02' },
            { name: 'Material de Escritório', color: '#0891b2', account_code: '4.1.03' },
            { name: 'Software e Licenças', color: '#7c3aed', account_code: '4.1.04' },
            { name: 'Energia Elétrica', color: '#ea580c', account_code: '4.1.05' },
            { name: 'Telefone/Internet', color: '#0d9488', account_code: '4.1.06' },
            { name: 'Marketing', color: '#be185d', account_code: '4.1.07' },
            { name: 'Contabilidade', color: '#4338ca', account_code: '4.1.08' },
            { name: 'Impostos', color: '#991b1b', account_code: '4.1.09' },
            { name: 'Viagens', color: '#92400e', account_code: '4.1.10' }
        ];
        for (const source of incomeSources) {
            await db.run('INSERT INTO income_sources (id, user_id, name, type, color, account_code) VALUES (?, ?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), 'default', source.name, source.type, source.color, source.account_code]);
        }
        for (const category of expenseCategories) {
            await db.run('INSERT INTO expense_categories (id, user_id, name, color, account_code) VALUES (?, ?, ?, ?, ?)', [(0, uuid_1.v4)(), 'default', category.name, category.color, category.account_code]);
        }
        console.log(`✅ Inseridas ${incomeSources.length} fontes de receita padrão`);
        console.log(`✅ Inseridas ${expenseCategories.length} categorias de despesa padrão`);
        console.log('✅ Dados padrão populados com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro ao popular dados padrão:', error);
    }
    finally {
        await db.close();
    }
}
populateDefaultData().catch(console.error);
//# sourceMappingURL=populate-default-data.js.map