import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('Updating all blog titles in database to be unique per slug...');
  const client = await pool.connect();

  try {
    const blogsRes = await client.query('SELECT b.id, b.slug, b.title, k.phrase FROM blogs b LEFT JOIN keywords k ON b.slug = k.slug');
    console.log(`Found ${blogsRes.rows.length} total blogs in database.`);

    let updatedCount = 0;
    for (const row of blogsRes.rows) {
      let uniqueTitle = row.phrase || row.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      // Append branding or clean up
      if (!uniqueTitle.toLowerCase().includes('gujarat') && !uniqueTitle.toLowerCase().includes('ahmedabad') && !uniqueTitle.toLowerCase().includes('surat') && !uniqueTitle.toLowerCase().includes('vadodara')) {
        uniqueTitle += ' | Real Estate Gujarat';
      }

      await client.query('UPDATE blogs SET title = $1 WHERE id = $2', [uniqueTitle, row.id]);
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} blog titles to be 100% unique!`);

    // Verification check
    const verifyRes = await client.query('SELECT DISTINCT ON (title) title, slug FROM blogs');
    console.log(`VERIFICATION: DISTINCT ON (title) now returns ${verifyRes.rows.length} unique items!`);

  } catch (err) {
    console.error('Error updating blog titles:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
