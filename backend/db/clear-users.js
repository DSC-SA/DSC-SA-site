const pool = require('../config/database');

const clearUsers = async () => {
  try {
    console.log('⚠️  Clearing all users from the database...');
    
    // Delete all users
    const result = await pool.query('DELETE FROM users');
    
    console.log(`✓ Successfully deleted ${result.rowCount} user records`);
    console.log('✓ Database users table is now empty');
    
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing users:', err);
    await pool.end();
    process.exit(1);
  }
};

clearUsers();
