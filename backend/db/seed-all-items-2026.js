const pool = require('../config/database');

const seedAllItems = async () => {
  const items = [
    // ATTACK ITEMS
    { name: 'Berserker\'s Fury', category: 'Attack', damage_type: 'Physical', description: 'Critical damage + Attack power' },
    { name: 'Blade of Despair', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Lifesteal' },
    { name: 'Blade of the Heptaseas', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Movement speed' },
    { name: 'Corrosion Scythe', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Slow on hit' },
    { name: 'Demon Hunter Sword', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + True damage effect' },
    { name: 'Endless Battle', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Lifesteal + True damage' },
    { name: 'Fleeting Time', category: 'Attack', damage_type: 'Magic', description: 'Magic power + CDR + Cooldown reset on kill' },
    { name: 'Golden Staff', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Critical chance' },
    { name: 'Great Dragon Spear', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Penetration' },
    { name: 'Haas\'s Claws', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Lifesteal' },
    { name: 'Hunter Strike', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + CDR on hit' },
    { name: 'Malefic Gun', category: 'Attack', damage_type: 'Physical', description: 'Attack damage + Movement speed' },
    { name: 'Malefic Roar', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Armor penetration' },
    { name: 'Rose Gold Meteor', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Slow effect' },
    { name: 'Sea Halberd', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Healing reduction' },
    { name: 'Sky Piercer', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Magic damage' },
    { name: 'War Axe', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + HP' },
    { name: 'Wind of Nature', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Shield effect' },
    { name: 'Windtalker', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Movement speed' },
    { name: 'Winter Crown', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Freeze effect' },
    { name: 'Fury Hammer', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Crowd control' },
    { name: 'Legion Sword', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + HP recovery' },
    { name: 'Magic Blade', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Magic' },
    { name: 'Ogre Tomahawk', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Life steal' },
    { name: 'Regular Spear', category: 'Attack', damage_type: 'Physical', description: 'Physical damage basic item' },
    { name: 'Rogue Meteor', category: 'Attack', damage_type: 'Physical', description: 'Physical damage + Slow' },
    { name: 'Swift Crossbow', category: 'Attack', damage_type: 'Physical', description: 'Attack speed + Movement' },
    { name: 'Dagger', category: 'Attack', damage_type: 'Physical', description: 'Attack speed basic item' },
    { name: 'Expert Gloves', category: 'Attack', damage_type: 'Hybrid', description: 'Physical + Magic power' },
    { name: 'Iron Hunting Bow', category: 'Attack', damage_type: 'Physical', description: 'Attack damage + Armor penetration' },
    { name: 'Javelin', category: 'Attack', damage_type: 'Physical', description: 'Physical damage basic item' },
    { name: 'Knife', category: 'Attack', damage_type: 'Physical', description: 'Physical damage basic item' },
    { name: 'Vampire Mallet', category: 'Attack', damage_type: 'Physical', description: 'Attack damage + Lifesteal' },
    { name: 'Power Potion', category: 'Attack', damage_type: 'Utility', description: 'Temporary power boost' },

    // MAGIC ITEMS
    { name: 'Blood Wings', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Shield' },
    { name: 'Clock of Destiny', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP + CDR' },
    { name: 'Concentrated Energy', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Shield on hit' },
    { name: 'Divine Glaive', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Magic penetration' },
    { name: 'Enchanted Talisman', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Mana + CDR' },
    { name: 'Feather of Heaven', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Movement speed' },
    { name: 'Flask of the Oasis', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Healing' },
    { name: 'Genius Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Magic penetration' },
    { name: 'Glowing Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Burn effect' },
    { name: 'Holy Crystal', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP' },
    { name: 'Ice Queen Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Slow effect' },
    { name: 'Lightning Truncheon', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Chain damage' },
    { name: 'Starlium Scythe', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Movement speed' },
    { name: 'Wishing Lantern', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Healing power' },
    { name: 'Azure Blade', category: 'Magic', damage_type: 'Magic', description: 'Magic power + CDR' },
    { name: 'Elegant Gem', category: 'Magic', damage_type: 'Magic', description: 'Magic power basic item' },
    { name: 'Exotic Veil', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Crowd control immunity' },
    { name: 'Mystic Container', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Cooldown' },
    { name: 'Tome of Evil', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Spell vamp' },
    { name: 'Book of Sages', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP regen' },
    { name: 'Magic Necklace', category: 'Magic', damage_type: 'Magic', description: 'Magic power basic item' },
    { name: 'Magic Wand', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Mana' },
    { name: 'Mystery Codex', category: 'Magic', damage_type: 'Magic', description: 'Magic power + Special effect' },
    { name: 'Power Crystal', category: 'Magic', damage_type: 'Magic', description: 'Magic power + HP' },
    { name: 'Flower of Hope', category: 'Magic', damage_type: 'Healing', description: 'Healing power item' },
    { name: 'Lantern of Hope', category: 'Magic', damage_type: 'Healing', description: 'Healing + Support' },
    { name: 'Magic Potion', category: 'Magic', damage_type: 'Utility', description: 'Temporary magic boost' },

    // DEFENSE ITEMS
    { name: 'Antique Cuirass', category: 'Defense', damage_type: 'Utility', description: 'Armor + Reflect damage' },
    { name: 'Athena\'s Shield', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + Damage reduction' },
    { name: 'Blade Armor', category: 'Defense', damage_type: 'Utility', description: 'Armor + Reflect damage' },
    { name: 'Brute Force Breastplate', category: 'Defense', damage_type: 'Utility', description: 'Armor + HP' },
    { name: 'Chastise Pauldron', category: 'Defense', damage_type: 'Utility', description: 'Armor + Special effect' },
    { name: 'Cursed Helmet', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + Crowd control' },
    { name: 'Dominance Ice', category: 'Defense', damage_type: 'Utility', description: 'Attack speed + Slow effect' },
    { name: 'Guardian Helmet', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + HP regen' },
    { name: 'Immortality', category: 'Defense', damage_type: 'Utility', description: 'HP + Revival on death' },
    { name: 'Oracle', category: 'Defense', damage_type: 'Utility', description: 'Magical resistance + Healing increase' },
    { name: 'Queen\'s Wings', category: 'Defense', damage_type: 'Utility', description: 'Armor + Shield' },
    { name: 'Radiant Armor', category: 'Defense', damage_type: 'Utility', description: 'Armor + Magic resistance' },
    { name: 'Thunder Belt', category: 'Defense', damage_type: 'Utility', description: 'HP + Armor + Damage aura' },
    { name: 'Ares Belt', category: 'Defense', damage_type: 'Utility', description: 'Armor + HP' },
    { name: 'Black Ice Shield', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + Slow' },
    { name: 'Dreadnaught Armor', category: 'Defense', damage_type: 'Utility', description: 'Armor + Damage reduction' },
    { name: 'Molten Essence', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + Defense' },
    { name: 'Silence Robe', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance + Silence' },
    { name: 'Steel Legplates', category: 'Defense', damage_type: 'Utility', description: 'Armor basic item' },
    { name: 'Healing Necklace', category: 'Defense', damage_type: 'Healing', description: 'HP regen item' },
    { name: 'Hero\'s Ring', category: 'Defense', damage_type: 'Utility', description: 'HP + Support' },
    { name: 'Leather Jerkin', category: 'Defense', damage_type: 'Utility', description: 'Armor basic item' },
    { name: 'Magic Resist Cloak', category: 'Defense', damage_type: 'Utility', description: 'Magic resistance basic item' },
    { name: 'Vitality Crystal', category: 'Defense', damage_type: 'Utility', description: 'HP + Healing' },
    { name: 'Rock Potion', category: 'Defense', damage_type: 'Utility', description: 'Temporary defense boost' },

    // MOVEMENT ITEMS
    { name: 'Arcane Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Magic resistance' },
    { name: 'Demon Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Mana regen' },
    { name: 'Magic Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Cooldown' },
    { name: 'Rapid Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed high tier' },
    { name: 'Swift Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Attack speed' },
    { name: 'Tough Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Crowd control reduction' },
    { name: 'Warrior Boots', category: 'Movement', damage_type: 'Utility', description: 'Movement speed + Armor' },

    // JUNGLING ITEMS
    { name: 'Flame Retribution', category: 'Jungling', damage_type: 'Utility', description: 'Jungling item with fire damage' },
    { name: 'Ice Retribution', category: 'Jungling', damage_type: 'Utility', description: 'Jungling item with slow effect' },
    { name: 'Bloody Retribution', category: 'Jungling', damage_type: 'Utility', description: 'Jungling item with lifesteal' },

    // ROAMING ITEMS
    { name: 'Conceal', category: 'Roaming', damage_type: 'Utility', description: 'Roaming item for stealth' },
    { name: 'Encourage', category: 'Roaming', damage_type: 'Utility', description: 'Roaming item for support' },
    { name: 'Dire Hit', category: 'Roaming', damage_type: 'Utility', description: 'Roaming item for damage' },
    { name: 'Favor', category: 'Roaming', damage_type: 'Utility', description: 'Roaming item for protection' }
  ];

  try {
    console.log(`Seeding ${items.length} items to database...`);
    
    for (const item of items) {
      // Check if item already exists
      const existing = await pool.query(
        'SELECT id FROM items WHERE LOWER(name) = LOWER($1)',
        [item.name]
      );

      if (existing.rows.length === 0) {
        // Insert new item
        await pool.query(
          'INSERT INTO items (name, category, damage_type, description) VALUES ($1, $2, $3, $4)',
          [item.name, item.category, item.damage_type, item.description]
        );
        console.log(`✓ Added: ${item.name}`);
      } else {
        console.log(`⊘ Already exists: ${item.name}`);
      }
    }

    console.log('✓ Item seeding completed!');
  } catch (err) {
    console.error('Error seeding items:', err);
    throw err;
  }
};

module.exports = { seedAllItems };
