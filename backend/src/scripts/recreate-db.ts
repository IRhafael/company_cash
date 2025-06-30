import mysql from 'mysql2/promise';
import { initializeDatabase } from '../database/init';

async function recreateDatabase() {
  console.log('Recriando banco de dados...');

  try {
    // Limpar todas as tabelas do banco MySQL
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'italo',
      password: '', // Adapte se necessário
      database: 'company',
      multipleStatements: true,
    });

    // Desabilita checagem de chave estrangeira para truncar
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    const [tables] = await db.query("SHOW TABLES");
    for (const row of tables as any[]) {
      const tableName = Object.values(row)[0];
      await db.query(`TRUNCATE TABLE \`${tableName}\``);
    }
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    await db.end();

    // Recria as tabelas (caso precise rodar migrations/init)
    await initializeDatabase();
    console.log('Banco de dados limpo e recriado com sucesso');

  } catch (error) {
    console.error('Erro ao recriar banco:', error);
    process.exit(1);
  }
}

recreateDatabase();
