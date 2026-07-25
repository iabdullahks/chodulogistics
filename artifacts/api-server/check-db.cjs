'use strict';
const pg = require('pg');
const client = new pg.Client({ 
  connectionString: 'postgresql://postgres.tnvhhkqxvdqdlbmrqwnj:Ahmadchodu%221@35.79.125.133:6543/postgres?sslmode=no-verify' 
});

async function main() {
  await client.connect();
  
  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
  );
  console.log('TABLES:', tables.rows.map(r => r.table_name).join(', '));

  const roles = await client.query('SELECT * FROM roles');
  console.log('ROLES:', JSON.stringify(roles.rows));

  await client.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
