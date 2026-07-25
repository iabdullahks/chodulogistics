// One-time admin user creation script using absolute pnpm paths
import bcrypt from 'C:/Users/iabdu/Downloads/chodulogistics/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/dist/bcrypt.js';
import pg from 'C:/Users/iabdu/Downloads/chodulogistics/node_modules/.pnpm/pg@8.22.0/node_modules/pg/lib/index.js';

const DATABASE_URL = 'postgresql://postgres.tnvhhkqxvdqdlbmrqwnj:Ahmadchodu%221@35.79.125.133:6543/postgres?sslmode=no-verify';

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });

const EMAIL = 'winston@brokeragecompanyofamericaninc.com';
const PASSWORD = 'Dispatch@007722';
const NAME = 'Winston Admin';

async function main() {
  const client = await pool.connect();
  try {
    // Get available roles
    const rolesResult = await client.query(
      "SELECT id, name FROM roles ORDER BY id LIMIT 5"
    );
    console.log('Available roles:', rolesResult.rows);

    let roleId;
    if (rolesResult.rows.length === 0) {
      const roleInsert = await client.query(
        "INSERT INTO roles (name) VALUES ('superadmin') RETURNING id, name"
      );
      console.log('Created role:', roleInsert.rows[0]);
      roleId = roleInsert.rows[0].id;
    } else {
      roleId = rolesResult.rows[0].id;
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    // Check if user already exists
    const existing = await client.query(
      'SELECT id, email FROM admin_users WHERE email = $1',
      [EMAIL]
    );

    if (existing.rows.length > 0) {
      await client.query(
        'UPDATE admin_users SET password_hash = $1, is_active = true WHERE email = $2',
        [passwordHash, EMAIL]
      );
      console.log(`\n✅ Updated password for: ${EMAIL}`);
    } else {
      const result = await client.query(
        'INSERT INTO admin_users (email, password_hash, name, role_id, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, email, name',
        [EMAIL, passwordHash, NAME, roleId]
      );
      console.log('\n✅ Created admin user:', result.rows[0]);
    }

    console.log(`\n📧 Email:    ${EMAIL}`);
    console.log(`🔑 Password: ${PASSWORD}`);
    console.log('\nYou can now log in at http://localhost:5173/');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
