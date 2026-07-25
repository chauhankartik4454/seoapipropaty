import dotenv from 'dotenv';
dotenv.config();

const SYNC_URL = 'http://localhost:3000/api/seo/sync-client';
const INTERVAL_MS = 60 * 60 * 1000; // 1 Hour (60 minutes)

async function runSyncJob() {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] 🔄 Triggering hourly client property auto-sync...`);

  try {
    const res = await fetch(SYNC_URL, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      console.log(`[${timestamp}] ✅ Auto-Sync Complete! Synced ${data.synced_to_seo_engine} properties. ${data.indexing_status}`);
    } else {
      console.error(`[${timestamp}] ⚠️ Auto-Sync failed with status: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error running auto-sync cron:`, error);
  }
}

// Execute immediately on startup
runSyncJob();

// Schedule every 1 hour
setInterval(runSyncJob, INTERVAL_MS);
console.log(`🚀 Hourly Client Auto-Sync Cron Worker active! Running every 60 minutes...`);
