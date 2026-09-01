const pool = require('../config/database');

const addAvatarDataToUsers = async () => {
  console.log('🔄 Adding avatar_data column to users table...');

  // Check if column exists
  const checkResult = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_data'
  `);

  if (checkResult.rows.length > 0) {
    console.log('✓ avatar_data column already exists');
    return;
  }

  // Add avatar_data column to store binary image data
  await pool.query(`
    ALTER TABLE users 
    ADD COLUMN avatar_data BYTEA
  `);

  console.log('✓ Successfully added avatar_data column to users table');
};

// Run as standalone script if executed directly
if (require.main === module) {
  addAvatarDataToUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { addAvatarDataToUsers };