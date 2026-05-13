const pool = require('../config/database');

const migrateItemsImageData = async () => {
  try {
    console.log('🔄 Checking if items table has image_data column...');

    // Check if image_data column exists
    const checkImageDataColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'items' AND column_name = 'image_data'
    `);

    if (checkImageDataColumn.rows.length === 0) {
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

    // Check if image_mimetype column exists
    const checkMimetypeColumn = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'items' AND column_name = 'image_mimetype'
    `);

    if (checkMimetypeColumn.rows.length === 0) {
      console.log('❌ image_mimetype column not found, adding it...');
      
      // Add the column if it doesn't exist
      await pool.query(`
        ALTER TABLE items 
        ADD COLUMN image_mimetype VARCHAR(50)
      `);
      
      console.log('✅ Successfully added image_mimetype column to items table');
    } else {
      console.log('✅ image_mimetype column already exists');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }
};

module.exports = { migrateItemsImageData };
