#!/usr/bin/env node
import mysql from 'mysql2/promise';

const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'CELC',
};

async function showCols(table){
  const conn = await mysql.createConnection(DB_CONFIG);
  try{
    const [rows] = await conn.query(`SHOW COLUMNS FROM \`${table}\``);
    console.log('\nCOLUMNS FROM', table);
    for(const r of rows) console.log(r.Field, r.Type, r.Null, r.Key, r.Extra);
  }catch(e){
    console.error('Error reading', table, e.message);
  }finally{
    await conn.end();
  }
}

(async ()=>{
  const tables = ['Roles','Usuarios','Equipos','Lineas','Asignaciones','Revisiones','RegistroErrores'];
  for(const t of tables) await showCols(t);
})();
