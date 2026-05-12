const pool = require('../config/database');
const itemsList = require('./mlbb-items-official.json');

const seedAllItems = async () => {
  try {
    console.log(`Seeding ${itemsList.items.length} official MLBB items to database...`);
    
    // Clear existing items first
    await pool.query('DELETE FROM items');
    console.log('✓ Cleared existing items');
    
    for (const item of itemsList.items) {
      // Insert new item
      await pool.query(
        'INSERT INTO items (name, category, damage_type, description) VALUES ($1, $2, $3, $4)',
        [
          item.name, 
          item.category, 
          item.category.includes('Physical') ? 'Physical' : 
          item.category.includes('Magic') ? 'Magic' : 
          item.category.includes('Defense') ? 'Defense' : 
          item.category.includes('Boots') ? 'Boots' : 'Utility',
          item.description
        ]
      );
      console.log(`✓ Added: ${item.name}`);
    }

    console.log('✓ Item seeding completed!');
  } catch (err) {
    console.error('Error seeding items:', err);
    throw err;
  }
};

module.exports = { seedAllItems };
