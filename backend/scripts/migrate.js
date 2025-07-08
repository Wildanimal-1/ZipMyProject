const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Running database migration...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - projects');
    console.log('   - orders');
    console.log('   - user_downloads');
    console.log('   - contact_messages');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();