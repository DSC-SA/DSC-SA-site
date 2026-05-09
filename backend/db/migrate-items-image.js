const pool = require('../config/database');

const migrateItemsImage = async () => {
  try {
    console.log('Running migration: add image column to items table...');
    
    // Add image column if it doesn't exist
    await pool.query(`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS image VARCHAR(255)
    `);
    
    console.log('✓ Migration completed: image column added to items table');
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  }
};

module.exports = { migrateItemsImage };
