// Test database connection and log diagnostic info
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  const logPath = '/Users/mohammad/Desktop/Cold DM Tracker/.cursor/debug.log';
  const fs = require('fs');
  
  function log(data) {
    const entry = {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      location: 'test-db-connection.js',
      ...data
    };
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
  }

  log({ message: 'Starting database connection test', hypothesisId: 'A' });
  
  // Log DATABASE_URL format (without password)
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    log({ message: 'DATABASE_URL is missing', hypothesisId: 'A', data: { hasUrl: false } });
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Parse URL to check format (hide password)
  try {
    const url = new URL(dbUrl);
    log({ 
      message: 'DATABASE_URL parsed successfully', 
      hypothesisId: 'A',
      data: {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        username: url.username,
        hasPassword: !!url.password,
        searchParams: Object.fromEntries(url.searchParams)
      }
    });
  } catch (e) {
    log({ 
      message: 'Failed to parse DATABASE_URL', 
      hypothesisId: 'A',
      data: { error: e.message, urlLength: dbUrl.length }
    });
    console.error('ERROR: DATABASE_URL format is invalid');
    process.exit(1);
  }

  log({ message: 'Attempting Prisma connection', hypothesisId: 'B' });

  try {
    // Try to connect
    await prisma.$connect();
    log({ message: 'Prisma connection successful', hypothesisId: 'B', data: { connected: true } });
    console.log('✓ Database connection successful!');
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    log({ message: 'Database query successful', hypothesisId: 'B', data: { queryWorked: true } });
    console.log('✓ Database query successful!');
    
  } catch (error) {
    log({ 
      message: 'Database connection/query failed', 
      hypothesisId: 'B',
      data: { 
        error: error.message,
        errorCode: error.code,
        errorName: error.name
      }
    });
    console.error('✗ Database connection failed:');
    console.error(error.message);
    if (error.code) console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
    log({ message: 'Connection test completed', hypothesisId: 'B' });
  }
}

testConnection().catch(console.error);

