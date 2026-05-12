const pool = require('../config/database');

const clearItemImages = async () => {
  try {
    console.log('🔍 Checking for item images in database...');

    // Check how many items have image data
    const checkImages = await pool.query(`
      SELECT id, name FROM items WHERE image_data IS NOT NULL
    `);

    if (checkImages.rows.length === 0) {
      console.log('✅ No item images found in database');
      return;
    }

    console.log(`Found ${checkImages.rows.length} items with images:`);
    checkImages.rows.forEach(row => {
      console.log(`  - ${row.name} (ID: ${row.id})`);
    });

    // Clear all item image data
    const result = await pool.query(`
      UPDATE items SET image_data = NULL WHERE image_data IS NOT NULL
    `);

    console.log(`✅ Cleared ${result.rowCount} item images from database`);
  } catch (err) {
    console.error('❌ Error clearing item images:', err.message);
  }
};

// Run if called directly
if (require.main === module) {
  clearItemImages().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { clearItemImages };
