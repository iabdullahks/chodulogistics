// One-time shipment creation script (CommonJS)
'use strict';

const { createRequire } = require('module');
const require2 = createRequire(require('url').pathToFileURL(__filename).href);

const pg = require2('pg');

const DATABASE_URL = 'postgresql://postgres.tnvhhkqxvdqdlbmrqwnj:Ahmadchodu%221@35.79.125.133:6543/postgres?sslmode=no-verify';

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });

const TRACKING_NUMBER = 'TL-TEST12345';
const STATUS = 'In Transit';
const ORIGIN = 'Berwyn, IL';
const DESTINATION = 'Brentwood, NY';
const CARRIER_NAME = 'Brokerage Co. of American INC';
const ESTIMATED_DELIVERY = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
const LAST_UPDATE = 'Departed origin facility';

async function main() {
  const client = await pool.connect();
  try {
    // Check if shipment already exists
    const existing = await client.query(
      'SELECT id FROM shipments WHERE tracking_number = $1',
      [TRACKING_NUMBER]
    );

    if (existing.rows.length > 0) {
      await client.query(
        'UPDATE shipments SET status = $1, origin = $2, destination = $3, carrier_name = $4, estimated_delivery = $5, last_update = $6 WHERE tracking_number = $7',
        [STATUS, ORIGIN, DESTINATION, CARRIER_NAME, ESTIMATED_DELIVERY, LAST_UPDATE, TRACKING_NUMBER]
      );
      console.log(`\n✅ Updated existing shipment: ${TRACKING_NUMBER}`);
    } else {
      const result = await client.query(
        'INSERT INTO shipments (tracking_number, status, origin, destination, carrier_name, estimated_delivery, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, tracking_number',
        [TRACKING_NUMBER, STATUS, ORIGIN, DESTINATION, CARRIER_NAME, ESTIMATED_DELIVERY, LAST_UPDATE]
      );
      console.log('\n✅ Created new test shipment:', result.rows[0]);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
