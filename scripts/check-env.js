// Check environment variables without exposing secrets
const fs = require('fs');
const path = require('path');

const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';

function log(data) {
  const entry = {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    location: 'check-env.js',
    ...data
  };
  try {
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
  } catch (e) {
    // Log file might not exist yet
  }
}

// Check .env file
const envPath = path.join(__dirname, '..', '.env');
log({ message: 'Checking for .env file', hypothesisId: 'A', data: { path: envPath, exists: fs.existsSync(envPath) } });

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasDatabaseUrl = envContent.includes('DATABASE_URL');
  log({ message: '.env file found', hypothesisId: 'A', data: { hasDatabaseUrl, fileSize: envContent.length } });
  
  // Check DATABASE_URL format without exposing password
  const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
  if (dbUrlMatch) {
    const dbUrl = dbUrlMatch[1].trim().replace(/^["']|["']$/g, '');
    try {
      const url = new URL(dbUrl);
      log({ 
        message: 'DATABASE_URL format analysis', 
        hypothesisId: 'B',
        data: {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          username: url.username,
          hasPassword: !!url.password,
          hasProjectRef: url.hostname.includes('.supabase.com'),
          isPooler: url.hostname.includes('pooler'),
          searchParams: Object.fromEntries(url.searchParams)
        }
      });
      
      // Check for common Supabase issues
      if (url.hostname.includes('supabase.com')) {
        const projectRefMatch = url.hostname.match(/\.([a-z0-9]+)\.supabase\.com/);
        if (!projectRefMatch && !url.hostname.includes('pooler')) {
          log({ message: 'Possible issue: Missing project reference in hostname', hypothesisId: 'B' });
        }
        
        if (url.port === '6543' && !url.searchParams.has('pgbouncer')) {
          log({ message: 'Possible issue: Using pooler port without pgbouncer param', hypothesisId: 'D' });
        }
      }
    } catch (e) {
      log({ message: 'Failed to parse DATABASE_URL', hypothesisId: 'B', data: { error: e.message } });
    }
  } else {
    log({ message: 'DATABASE_URL not found in .env', hypothesisId: 'A' });
  }
} else {
  log({ message: '.env file does not exist', hypothesisId: 'A' });
}

console.log('Environment check complete. See debug.log for details.');

