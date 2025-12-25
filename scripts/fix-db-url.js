// Fix DATABASE_URL to include pgbouncer parameter for Supabase pooler
const fs = require('fs');
const path = require('path');

const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';

function log(data) {
  const entry = {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    location: 'fix-db-url.js',
    ...data
  };
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  log({ message: '.env file not found', hypothesisId: 'D' });
  console.error('ERROR: .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
log({ message: 'Reading .env file', hypothesisId: 'D', data: { fileSize: envContent.length } });

// Check if DATABASE_URL exists
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
if (!dbUrlMatch) {
  log({ message: 'DATABASE_URL not found in .env', hypothesisId: 'D' });
  console.error('ERROR: DATABASE_URL not found in .env file');
  process.exit(1);
}

const originalUrl = dbUrlMatch[1].trim().replace(/^["']|["']$/g, '');
log({ message: 'Original DATABASE_URL found', hypothesisId: 'D', data: { hasUrl: true, urlLength: originalUrl.length } });

try {
  const url = new URL(originalUrl);
  
  // Check if it's a Supabase pooler connection
  if (url.hostname.includes('pooler.supabase.com') && url.port === '6543') {
    log({ message: 'Detected Supabase pooler connection', hypothesisId: 'D', data: { hostname: url.hostname, port: url.port } });
    
    // Check if pgbouncer parameter is missing
    if (!url.searchParams.has('pgbouncer')) {
      log({ message: 'pgbouncer parameter missing, adding it', hypothesisId: 'D' });
      url.searchParams.set('pgbouncer', 'true');
      
      const fixedUrl = url.toString();
      log({ message: 'Fixed DATABASE_URL', hypothesisId: 'D', data: { newUrlLength: fixedUrl.length } });
      
      // Update .env file
      const newEnvContent = envContent.replace(
        /^DATABASE_URL=(.+)$/m,
        `DATABASE_URL="${fixedUrl}"`
      );
      
      fs.writeFileSync(envPath, newEnvContent, 'utf8');
      log({ message: '.env file updated successfully', hypothesisId: 'D' });
      console.log('✓ Fixed DATABASE_URL: Added pgbouncer=true parameter');
      console.log('  This is required for Supabase pooler connections (port 6543)');
    } else {
      log({ message: 'pgbouncer parameter already present', hypothesisId: 'D' });
      console.log('✓ DATABASE_URL already has pgbouncer parameter');
    }
  } else {
    log({ message: 'Not a Supabase pooler connection, no fix needed', hypothesisId: 'D', data: { hostname: url.hostname, port: url.port } });
    console.log('ℹ Not a Supabase pooler connection - checking other issues...');
    
    // If it's a direct Supabase connection, suggest using pooler
    if (url.hostname.includes('supabase.co') && url.port === '5432') {
      console.log('  Tip: Consider using the pooler connection (port 6543) with pgbouncer=true');
    }
  }
} catch (e) {
  log({ message: 'Error parsing DATABASE_URL', hypothesisId: 'D', data: { error: e.message } });
  console.error('ERROR: Invalid DATABASE_URL format:', e.message);
  process.exit(1);
}

