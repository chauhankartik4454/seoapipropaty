import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to database...');
    const res = await pool.query(
      `INSERT INTO keywords (phrase, slug, category, is_active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) 
       DO UPDATE SET 
         phrase = EXCLUDED.phrase,
         category = EXCLUDED.category,
         is_active = true
       RETURNING *;`,
      ['Real Estate Gujarat', 'real-estate-gujarat', 'HOMEPAGE', true]
    );
    console.log('Successfully inserted/updated real-estate-gujarat:', res.rows[0]);
  } catch (err) {
    console.error('Error seeding keyword:', err);
  } finally {
    await pool.end();
  }
}

run();
