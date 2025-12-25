// Fix Supabase connection string to use correct port and parameters
const fs = require('fs');
const path = require('path');

const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';

function log(data) {
  const entry = {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run2',
    location: 'fix-supabase-connection.js',
    ...data
  };
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  log({ message: '.env file not found', hypothesisId: 'C' });
  console.error('ERROR: .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
log({ message: 'Reading .env file', hypothesisId: 'C', data: { fileSize: envContent.length } });

// Find and replace DATABASE_URL
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
if (!dbUrlMatch) {
  log({ message: 'DATABASE_URL not found', hypothesisId: 'C' });
  console.error('ERROR: DATABASE_URL not found in .env');
  process.exit(1);
}

const originalUrl = dbUrlMatch[1].trim().replace(/^["']|["']$/g, '');
log({ message: 'Original URL extracted', hypothesisId: 'C', data: { urlLength: originalUrl.length } });

try {
  const url = new URL(originalUrl);
  
  log({ 
    message: 'Parsed URL before fix', 
    hypothesisId: 'C',
    data: {
      hostname: url.hostname,
      port: url.port,
      username: url.username,
      searchParams: Object.fromEntries(url.searchParams)
    }
  });

  let fixed = false;
  let fixedUrl = new URL(originalUrl);

  // Check if it's a Supabase pooler connection
  if (url.hostname.includes('pooler.supabase.com')) {
    log({ message: 'Detected Supabase pooler hostname', hypothesisId: 'C' });
    
    // Fix 1: Change port from 5432 to 6543 if needed
    if (url.port === '5432' || !url.port) {
      fixedUrl.port = '6543';
      fixed = true;
      log({ message: 'Fixed port to 6543', hypothesisId: 'C', data: { oldPort: url.port, newPort: '6543' } });
    }
    
    // Fix 2: Add pgbouncer=true parameter
    if (!fixedUrl.searchParams.has('pgbouncer')) {
      fixedUrl.searchParams.set('pgbouncer', 'true');
      fixed = true;
      log({ message: 'Added pgbouncer=true parameter', hypothesisId: 'D' });
    }
    
    // Fix 3: Ensure connection_pool_limit is set (optional but recommended)
    if (!fixedUrl.searchParams.has('connection_limit')) {
      fixedUrl.searchParams.set('connection_limit', '1');
      log({ message: 'Added connection_limit=1 for Prisma', hypothesisId: 'D' });
    }
  } else if (url.hostname.includes('.supabase.co')) {
    // Direct connection
    log({ message: 'Detected Supabase direct connection', hypothesisId: 'E' });
    if (!fixedUrl.searchParams.has('sslmode')) {
      fixedUrl.searchParams.set('sslmode', 'require');
      fixed = true;
      log({ message: 'Added sslmode=require', hypothesisId: 'E' });
    }
  }

  if (fixed) {
    const newUrl = fixedUrl.toString();
    log({ message: 'URL fixed successfully', hypothesisId: 'C', data: { newUrlLength: newUrl.length } });
    
    // Update .env file
    const newEnvContent = envContent.replace(
      /^DATABASE_URL=(.+)$/m,
      `DATABASE_URL="${newUrl}"`
    );
    
    fs.writeFileSync(envPath, newEnvContent, 'utf8');
    log({ message: '.env file updated', hypothesisId: 'C' });
    
    console.log('✓ Fixed DATABASE_URL connection string!');
    console.log('\nChanges made:');
    if (url.port === '5432' && fixedUrl.port === '6543') {
      console.log('  - Changed port from 5432 to 6543 (pooler connection)');
    }
    if (!url.searchParams.has('pgbouncer') && fixedUrl.searchParams.has('pgbouncer')) {
      console.log('  - Added ?pgbouncer=true parameter (required for pooler)');
    }
    if (!url.searchParams.has('connection_limit') && fixedUrl.searchParams.has('connection_limit')) {
      console.log('  - Added ?connection_limit=1 (recommended for Prisma)');
    }
    console.log('\nYour connection string is now correctly configured for Supabase pooler.');
    console.log('\nTry running: npx prisma migrate dev --name init');
  } else {
    log({ message: 'No fixes needed', hypothesisId: 'C' });
    console.log('✓ Connection string looks correct. If you\'re still getting errors,');
    console.log('  the issue might be with your Supabase credentials (password/project ref).');
    console.log('\nVerify in Supabase dashboard:');
    console.log('  1. Go to Settings > Database');
    console.log('  2. Check "Connection string" under "Connection pooling"');
    console.log('  3. Make sure you\'re using the "Transaction" mode connection string');
  }

} catch (e) {
  log({ message: 'Error fixing URL', hypothesisId: 'C', data: { error: e.message } });
  console.error('ERROR:', e.message);
  process.exit(1);
}

