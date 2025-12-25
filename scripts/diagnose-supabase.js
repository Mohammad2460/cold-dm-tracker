// Diagnose Supabase connection string issues
const fs = require('fs');
const path = require('path');

const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';

function log(data) {
  const entry = {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run2',
    location: 'diagnose-supabase.js',
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

const envContent = fs.readFileSync(envPath, 'utf8');
log({ message: 'Reading .env file', hypothesisId: 'C', data: { fileSize: envContent.length } });

// Find DATABASE_URL
const dbUrlLines = envContent.split('\n').filter(line => line.trim().startsWith('DATABASE_URL'));
log({ message: 'Found DATABASE_URL lines', hypothesisId: 'C', data: { count: dbUrlLines.length } });

if (dbUrlLines.length === 0) {
  log({ message: 'No DATABASE_URL found', hypothesisId: 'C' });
  console.error('ERROR: DATABASE_URL not found in .env');
  process.exit(1);
}

// Get the first DATABASE_URL (should be only one)
const dbUrlLine = dbUrlLines[0];
const urlMatch = dbUrlLine.match(/DATABASE_URL=(.+)/);
if (!urlMatch) {
  log({ message: 'Could not parse DATABASE_URL line', hypothesisId: 'C' });
  console.error('ERROR: Could not parse DATABASE_URL');
  process.exit(1);
}

const dbUrl = urlMatch[1].trim().replace(/^["']|["']$/g, '');
log({ message: 'Extracted DATABASE_URL', hypothesisId: 'C', data: { urlLength: dbUrl.length, startsWithPostgres: dbUrl.startsWith('postgres') } });

try {
  const url = new URL(dbUrl);
  
  log({ 
    message: 'Parsed DATABASE_URL', 
    hypothesisId: 'C',
    data: {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      username: url.username,
      hasPassword: !!url.password,
      passwordLength: url.password ? url.password.length : 0,
      searchParams: Object.fromEntries(url.searchParams),
      isSupabase: url.hostname.includes('supabase'),
      isPooler: url.hostname.includes('pooler'),
    }
  });

  // Check for Supabase-specific issues
  const issues = [];
  
  if (url.hostname.includes('supabase.com')) {
    // Check username format
    if (url.username.includes('.')) {
      // Format: postgres.projectref
      const parts = url.username.split('.');
      if (parts[0] !== 'postgres') {
        issues.push('Username should start with "postgres." for pooler connections');
        log({ message: 'Invalid username format for pooler', hypothesisId: 'C', data: { username: url.username } });
      }
    }
    
    // Check port and parameters
    if (url.port === '6543') {
      // Pooler connection - needs pgbouncer=true
      if (!url.searchParams.has('pgbouncer')) {
        issues.push('Pooler connection (port 6543) requires ?pgbouncer=true parameter');
        log({ message: 'Missing pgbouncer parameter for pooler', hypothesisId: 'D' });
      }
    } else if (url.port === '5432') {
      // Direct connection - needs sslmode=require
      if (!url.searchParams.has('sslmode')) {
        issues.push('Direct connection (port 5432) should have ?sslmode=require');
        log({ message: 'Missing sslmode parameter for direct connection', hypothesisId: 'E' });
      }
    }
    
    // Check if using pooler format with wrong port
    if (url.username.includes('.') && url.port === '5432') {
      issues.push('Username format suggests pooler connection, but port is 5432 (should be 6543)');
      log({ message: 'Mismatch: pooler username format with direct port', hypothesisId: 'C' });
    }
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
    console.log('\n');
  }
  
  // Generate correct connection string
  console.log('Current connection string analysis:');
  console.log(`  Host: ${url.hostname}`);
  console.log(`  Port: ${url.port}`);
  console.log(`  Username: ${url.username}`);
  console.log(`  Database: ${url.pathname.replace('/', '')}`);
  console.log(`  Parameters: ${url.search}`);
  
  if (url.hostname.includes('pooler.supabase.com')) {
    console.log('\n✓ Detected Supabase pooler connection');
    if (url.port === '6543' && !url.searchParams.has('pgbouncer')) {
      console.log('\n🔧 Fix: Add ?pgbouncer=true to your connection string');
      const fixedUrl = new URL(dbUrl);
      fixedUrl.searchParams.set('pgbouncer', 'true');
      console.log(`\nCorrected DATABASE_URL:\nDATABASE_URL="${fixedUrl.toString()}"`);
    } else if (url.port === '5432') {
      console.log('\n⚠️  Using port 5432 with pooler hostname - this may cause issues');
      console.log('   Consider using port 6543 with ?pgbouncer=true');
    }
  } else if (url.hostname.includes('.supabase.co')) {
    console.log('\n✓ Detected Supabase direct connection');
    if (!url.searchParams.has('sslmode')) {
      console.log('\n🔧 Fix: Add ?sslmode=require to your connection string');
      const fixedUrl = new URL(dbUrl);
      fixedUrl.searchParams.set('sslmode', 'require');
      console.log(`\nCorrected DATABASE_URL:\nDATABASE_URL="${fixedUrl.toString()}"`);
    }
  }
  
} catch (e) {
  log({ message: 'Error parsing DATABASE_URL', hypothesisId: 'C', data: { error: e.message } });
  console.error('ERROR: Invalid DATABASE_URL format:', e.message);
  process.exit(1);
}

