// Verify Supabase credentials format
const fs = require('fs');
const path = require('path');

const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';

function log(data) {
  const entry = {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run3',
    location: 'verify-credentials.js',
    ...data
  };
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
const dbUrl = dbUrlMatch[1].trim().replace(/^["']|["']$/g, '');

const url = new URL(dbUrl);

log({ 
  message: 'Current connection string analysis', 
  hypothesisId: 'C',
  data: {
    hostname: url.hostname,
    port: url.port,
    username: url.username,
    hasPassword: !!url.password,
    passwordLength: url.password ? url.password.length : 0,
    searchParams: Object.fromEntries(url.searchParams)
  }
});

// Extract project reference from username
const usernameParts = url.username.split('.');
if (usernameParts.length === 2 && usernameParts[0] === 'postgres') {
  const projectRef = usernameParts[1];
  log({ message: 'Extracted project reference', hypothesisId: 'C', data: { projectRef, projectRefLength: projectRef.length } });
  
  console.log('\n📋 Connection String Analysis:');
  console.log(`   Project Reference: ${projectRef}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port} ${url.port === '6543' ? '✓ (pooler)' : '✗ (wrong)'}`);
  console.log(`   Parameters: ${url.search}`);
  
  console.log('\n⚠️  "Tenant or user not found" error means:');
  console.log('   1. The project reference might be incorrect');
  console.log('   2. The password might be wrong');
  console.log('   3. The Supabase project might not exist');
  
  console.log('\n🔍 How to fix:');
  console.log('   1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to Settings > Database');
  console.log('   4. Under "Connection string", select "Transaction" mode');
  console.log('   5. Copy the connection string (it should look like):');
  console.log('      postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true');
  console.log('   6. Replace DATABASE_URL in your .env file with the new connection string');
  console.log('\n   Make sure:');
  console.log('   - You\'re using the "Transaction" mode (not Session or Statement)');
  console.log('   - The port is 6543 (pooler)');
  console.log('   - It includes ?pgbouncer=true');
  console.log('   - The password is correct (it\'s the database password, not your Supabase account password)');
}

