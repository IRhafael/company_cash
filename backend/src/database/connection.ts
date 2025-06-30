import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'italo',
  password: '1234', // ajuste conforme necessário
  database: 'company',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
