const pool = require('../config/database');

const migrateItemsImageData = async () => {
  try {
    console.log('🔄 Checking if items table has image_data column...');

    // Check if image_data column exists
    const checkColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'items' AND column_name = 'image_data'
    `);

    if (checkColumn.rows.length === 0) {
      console.log('❌ image_data column not found, adding it...');
      
      // Add the column if it doesn't exist
      await pool.query(`
        ALTER TABLE items 
        ADD COLUMN image_data BYTEA
      `);
      
      console.log('✅ Successfully added image_data column to items table');
    } else {
      console.log('✅ image_data column already exists');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }
};

module.exports = { migrateItemsImageData };
