const pool = require('../config/database');

const addAvatarDataToUsers = async () => {
  try {
    console.log('🔄 Adding avatar_data column to users table...');
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'avatar_data'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✓ avatar_data column already exists');
      process.exit(0);
    }

    // Add avatar_data column to store binary image data
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN avatar_data BYTEA
    `);

    console.log('✓ Successfully added avatar_data column to users table');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

addAvatarDataToUsers();
