const pool = require('../config/database');

const addImageDataToItems = async () => {
  try {
    console.log('🔄 Adding image_data column to items table...');
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'items' AND column_name = 'image_data'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✓ image_data column already exists');
      process.exit(0);
    }

    // Add image_data column to store binary image data
    await pool.query(`
      ALTER TABLE items 
      ADD COLUMN image_data BYTEA
    `);

    console.log('✓ Successfully added image_data column to items table');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

addImageDataToItems();
