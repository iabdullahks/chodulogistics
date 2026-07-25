'use strict';
const pg = require('pg');
const client = new pg.Client({ 
  connectionString: 'postgresql://postgres.tnvhhkqxvdqdlbmrqwnj:Ahmadchodu%221@35.79.125.133:6543/postgres?sslmode=no-verify' 
});

async function main() {
  await client.connect();

  // Grant superadmin wildcard write access to all modules
  const result = await client.query(
    "UPDATE roles SET permissions = $1 WHERE name = 'superadmin' RETURNING id, name, permissions",
    [JSON.stringify({ "*": "write" })]
  );

  if (result.rows.length === 0) {
    console.log('No superadmin role found — creating one with full permissions...');
    const insert = await client.query(
      "INSERT INTO roles (name, permissions) VALUES ('superadmin', $1) RETURNING id, name, permissions",
      [JSON.stringify({ "*": "write" })]
    );
    console.log('Created:', insert.rows[0]);
  } else {
    console.log('✅ Updated superadmin permissions:', result.rows[0]);
  }

  await client.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
