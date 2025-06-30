"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../database/init");
async function recreateDatabase() {
    console.log('Recriando banco de dados...');
    try {
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(__dirname, '../database.sqlite');
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('Banco de dados antigo removido');
        }
        const db = await (0, init_1.initializeDatabase)();
        console.log('Novo banco de dados criado com sucesso');
        await db.close();
    }
    catch (error) {
        console.error('Erro ao recriar banco:', error);
        process.exit(1);
    }
}
recreateDatabase();
//# sourceMappingURL=recreate-db.js.map