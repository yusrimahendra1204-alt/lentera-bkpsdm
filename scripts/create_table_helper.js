// scripts/create_table_helper.js
const mysql = require('mysql2/promise');

async function fix() {
  const conn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2Sw3Ep8LH64tjUC.root',
    password: 'BmQmrKut89t8a5c0',
    database: 'persuratan_bkpsdm',
    connectTimeout: 30000,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });
  console.log('Connected! Adding username column and updating admin...');
  await conn.execute('ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS username VARCHAR(50) DEFAULT NULL');
  await conn.execute("UPDATE pegawai SET username = 'admin' WHERE role = 'admin'");
  console.log('Username column updated successfully!');
  await conn.end();
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
