const pool = require('../config/database');
const itemsList = require('./mlbb-items-official.json');

const seedAllItems = async () => {
  try {
    console.log(`Seeding ${itemsList.items.length} official MLBB items to database...`);
    
    // Clear existing items first
    await pool.query('DELETE FROM items');
    console.log('✓ Cleared existing items');
    
    for (const item of itemsList.items) {
      // Generate image URL - using MLBB game assets
      // Format: /uploads/items/item_name_slug.png
      const itemSlug = item.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const imageUrl = `/uploads/items/${itemSlug}.png`;
      
      // Insert new item with image field (placeholder path)
      await pool.query(
        'INSERT INTO items (name, category, damage_type, description, image) VALUES ($1, $2, $3, $4, $5)',
        [
          item.name, 
          item.category, 
          item.category.includes('Physical') ? 'Physical' : 
          item.category.includes('Magic') ? 'Magic' : 
          item.category.includes('Defense') ? 'Defense' : 
          item.category.includes('Boots') ? 'Boots' : 'Utility',
          item.description,
          imageUrl
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
