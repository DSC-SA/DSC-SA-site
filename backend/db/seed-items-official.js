const pool = require('../config/database');

const seedAllItems = async () => {
  const items = [
    // ATTACK (PHYSICAL) - 18 items
    { name: 'Blade of Despair', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Lifesteal' },
    { name: 'Sea Halberd', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Healing reduction' },
    { name: 'Malefic Roar', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Armor penetration' },
    { name: 'Sky Piercer', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Magic damage' },
    { name: 'Great Dragon Spear', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Penetration' },
    { name: 'Hunter Strike', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + CDR on hit' },
    { name: 'Blade of the Heptaseas', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Movement speed' },
    { name: 'Windtalker', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Movement speed' },
    { name: 'Endless Battle', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Lifesteal + True damage' },
    { name: 'Berserker\'s Fury', category: 'Attack', damage_type: 'Physical', description: 'Critical damage + Attack power' },
    { name: 'Haas\' Claws', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Lifesteal' },
    { name: 'Rose Gold Meteor', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Slow effect' },
    { name: 'Corrosion Scythe', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Slow on hit' },
    { name: 'Golden Staff', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Critical chance' },
    { name: 'Demon Hunter Sword', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + True damage effect' },
    { name: 'Wind of Nature', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Shield effect' },
    { name: 'War Axe', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + HP' },
    { name: 'Malefic Gun', category: 'Attack', damage_type: 'Physical', description: 'Attack damage + Movement speed' },

    // MAGIC - 16 items
    { name: 'Wishing Lantern', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Healing power' },
    { name: 'Blood Wings', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Shield' },
    { name: 'Holy Crystal', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP' },
    { name: 'Divine Glaive', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Magic penetration' },
    { name: 'Genius Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Magic penetration' },
    { name: 'Glowing Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Burn effect' },
    { name: 'Ice Queen Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Slow effect' },
    { name: 'Lightning Truncheon', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Chain damage' },
    { name: 'Fleeting Time', category: 'Magic', damage_type: 'Magic', description: 'Magic power + CDR + Cooldown reset on kill' },
    { name: 'Clock of Destiny', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP + CDR' },
    { name: 'Concentrated Energy', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Shield on hit' },
    { name: 'Enchanted Talisman', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Mana + CDR' },
    { name: 'Feather of Heaven', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Movement speed' },
    { name: 'Starlium Scythe', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Movement speed' },
    { name: 'Winter Crown', category: 'Magic', damage_type: 'Magic', description: 'Attack speed + Freeze effect' },
    { name: 'Flask of the Oasis', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Healing' },

    // DEFENSE - 13 items
    { name: 'Immortality', category: 'Defense', damage_type: 'Defense', description: 'HP + Revival on death' },
    { name: 'Dominance Ice', category: 'Defense', damage_type: 'Defense', description: 'Attack speed + Slow effect' },
    { name: 'Antique Cuirass', category: 'Defense', damage_type: 'Defense', description: 'Armor + Reflect damage' },
    { name: 'Athena\'s Shield', category: 'Defense', damage_type: 'Defense', description: 'Magic resistance + Damage reduction' },
    { name: 'Radiant Armor', category: 'Defense', damage_type: 'Defense', description: 'Armor + Magic resistance' },
    { name: 'Blade Armor', category: 'Defense', damage_type: 'Defense', description: 'Armor + Reflect damage' },
    { name: 'Twilight Armor', category: 'Defense', damage_type: 'Defense', description: 'HP + Armor + Reflect damage' },
    { name: 'Guardian Helmet', category: 'Defense', damage_type: 'Defense', description: 'Magic resistance + HP regen' },
    { name: 'Cursed Helmet', category: 'Defense', damage_type: 'Defense', description: 'Magic resistance + Crowd control' },
    { name: 'Oracle', category: 'Defense', damage_type: 'Defense', description: 'Magical resistance + Healing increase' },
    { name: 'Brute Force Breastplate', category: 'Defense', damage_type: 'Defense', description: 'Armor + HP' },
    { name: 'Thunder Belt', category: 'Defense', damage_type: 'Defense', description: 'HP + Armor + Damage aura' },
    { name: 'Queen\'s Wings', category: 'Defense', damage_type: 'Defense', description: 'Armor + Shield' },

    // MOVEMENT (BOOTS) - 7 items
    { name: 'Warrior Boots', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Armor' },
    { name: 'Tough Boots', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Crowd control reduction' },
    { name: 'Arcane Boots', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Magic resistance' },
    { name: 'Swift Boots', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Attack speed' },
    { name: 'Demon Shoes', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Mana regen' },
    { name: 'Magic Shoes', category: 'Boots', damage_type: 'Utility', description: 'Movement speed + Cooldown' },
    { name: 'Rapid Boots', category: 'Boots', damage_type: 'Utility', description: 'Movement speed high tier' },

    // ROAM & JUNGLE - 7 items
    { name: 'Conceal', category: 'Roam', damage_type: 'Utility', description: 'Roaming item for stealth' },
    { name: 'Encourage', category: 'Roam', damage_type: 'Utility', description: 'Roaming item for support' },
    { name: 'Favor', category: 'Roam', damage_type: 'Utility', description: 'Roaming item for protection' },
    { name: 'Dire Hit', category: 'Roam', damage_type: 'Utility', description: 'Roaming item for damage' },
    { name: 'Flame Retribution', category: 'Jungle', damage_type: 'Utility', description: 'Jungling item with fire damage' },
    { name: 'Ice Retribution', category: 'Jungle', damage_type: 'Utility', description: 'Jungling item with slow effect' },
    { name: 'Bloody Retribution', category: 'Jungle', damage_type: 'Utility', description: 'Jungling item with lifesteal' }
  ];

  try {
    console.log(`Seeding ${items.length} official MLBB items to database...`);
    
    // Clear existing items first
    await pool.query('DELETE FROM items');
    console.log('✓ Cleared existing items');
    
    for (const item of items) {
      // Insert new item
      await pool.query(
        'INSERT INTO items (name, category, damage_type, description) VALUES ($1, $2, $3, $4)',
        [item.name, item.category, item.damage_type, item.description]
      );
      console.log(`✓ Added: ${item.name}`);
    }

    console.log(`✓ Item seeding completed! Total items: ${items.length}`);
  } catch (err) {
    console.error('Error seeding items:', err);
    throw err;
  }
};

module.exports = { seedAllItems };
