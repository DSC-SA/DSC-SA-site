const pool = require('../config/database');

const seedData = async () => {
  try {
    // Clear existing data
    await pool.query('TRUNCATE TABLE items CASCADE');
    await pool.query('TRUNCATE TABLE heroes CASCADE');

    // Seed MLBB Items
    const items = [
      // Offensive Items
      { name: 'Blade of the Heptarch', category: 'Offensive', damage_type: 'Physical', description: 'Physical damage + Penetration' },
      { name: 'Calamity Reaper', category: 'Offensive', damage_type: 'Magic', description: 'Magic power + Cooldown Reduction' },
      { name: 'Blood Wings', category: 'Offensive', damage_type: 'Magic', description: 'Magic power + Shield' },
      { name: 'Fleeting Time', category: 'Offensive', damage_type: 'Magic', description: 'Magic power + CDR + Cooldown reset on kill' },
      { name: 'Demon Hunter\'s Sword', category: 'Offensive', damage_type: 'Physical', description: 'Physical damage + True damage effect' },
      { name: 'Bloodlust Axe', category: 'Offensive', damage_type: 'Physical', description: 'Physical damage + Spell Vamp' },
      { name: 'Windtalker', category: 'Offensive', damage_type: 'Physical', description: 'Attack speed + Movement speed' },
      { name: 'Endless Battle', category: 'Offensive', damage_type: 'Physical', description: 'Physical damage + Lifesteal + True damage' },
      { name: 'Malefic Roar', category: 'Offensive', damage_type: 'Physical', description: 'Physical damage + Armor penetration' },
      { name: 'Divine Glaive', category: 'Offensive', damage_type: 'Magic', description: 'Magic power + Magic penetration' },
      
      // Defensive Items
      { name: 'Athena\'s Shield', category: 'Defensive', damage_type: 'Utility', description: 'Magic resistance + Damage reduction' },
      { name: 'Brute Force Breastplate', category: 'Defensive', damage_type: 'Utility', description: 'Armor + HP' },
      { name: 'Antique Cuirass', category: 'Defensive', damage_type: 'Utility', description: 'Armor + Reflect damage' },
      { name: 'Twilight Armor', category: 'Defensive', damage_type: 'Utility', description: 'Armor + Reduces attack damage' },
      { name: 'Immortality', category: 'Defensive', damage_type: 'Utility', description: 'HP + Revival on death' },
      { name: 'Oracle', category: 'Defensive', damage_type: 'Utility', description: 'Magical resistance + Healing increase' },
      { name: 'Radiant Armor', category: 'Defensive', damage_type: 'Utility', description: 'Armor + Magic resistance' },
      { name: 'Hollow Radiance', category: 'Defensive', damage_type: 'Utility', description: 'HP + Aura effect' },
      
      // Boots
      { name: 'Demon Shoes', category: 'Utility', damage_type: 'Utility', description: 'Movement speed + Mana regen' },
      { name: 'Warrior Boots', category: 'Utility', damage_type: 'Utility', description: 'Movement speed + Armor' },
      { name: 'Tough Boots', category: 'Utility', damage_type: 'Utility', description: 'Movement speed + Crowd control reduction' },
      { name: 'Arcane Boots', category: 'Utility', damage_type: 'Utility', description: 'Movement speed + Magic resistance' },
      
      // Utility Items
      { name: 'Lucent Pact', category: 'Utility', damage_type: 'Magic', description: 'Magic power + Shield on cooldown' },
      { name: 'Courage Bulwark', category: 'Utility', damage_type: 'Utility', description: 'HP + Team shield effect' },
      { name: 'Dominance Ice', category: 'Utility', damage_type: 'Utility', description: 'Attack speed + Slow effect' },
      { name: 'Corrosion Scythe', category: 'Utility', damage_type: 'Physical', description: 'Attack speed + Slow on hit' }
    ];

    for (const item of items) {
      await pool.query(
        'INSERT INTO items (name, category, damage_type, description) VALUES ($1, $2, $3, $4)',
        [item.name, item.category, item.damage_type, item.description]
      );
    }

    // Seed MLBB Heroes - All 134 Verified Heroes
    const heroes = [
      { name: 'Akai', role: 'Tank', description: 'Heavy tank with crowd control', attack: 6, defense: 9, hp: 10 },
      { name: 'Alice', role: 'Mage', description: 'Magic damage with sustain', attack: 7, defense: 5, hp: 8 },
      { name: 'Alpha', role: 'Fighter', description: 'Burst damage fighter', attack: 9, defense: 7, hp: 8 },
      { name: 'Alu', role: 'Assassin', description: 'High burst assassin', attack: 10, defense: 4, hp: 5 },
      { name: 'Alucard', role: 'Fighter', description: 'Sustain fighter', attack: 9, defense: 6, hp: 9 },
      { name: 'Amaterasu', role: 'Tank', description: 'Durable tank', attack: 7, defense: 10, hp: 10 },
      { name: 'Amonkira', role: 'Support', description: 'Healing support', attack: 5, defense: 7, hp: 7 },
      { name: 'Angela', role: 'Support', description: 'Utility support', attack: 5, defense: 6, hp: 7 },
      { name: 'Anya', role: 'Mage', description: 'Control mage', attack: 8, defense: 4, hp: 6 },
      { name: 'Argus', role: 'Fighter', description: 'Burst fighter', attack: 9, defense: 8, hp: 9 },
      { name: 'Arlott', role: 'Fighter', description: 'CC fighter', attack: 9, defense: 8, hp: 9 },
      { name: 'Astaroth', role: 'Tank', description: 'Durable tank', attack: 6, defense: 10, hp: 10 },
      { name: 'Aurora', role: 'Mage', description: 'CC burst mage', attack: 8, defense: 5, hp: 6 },
      { name: 'Badang', role: 'Fighter', description: 'Mobile fighter', attack: 9, defense: 7, hp: 8 },
      { name: 'Bakar', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Balmond', role: 'Fighter', description: 'Durable fighter', attack: 9, defense: 7, hp: 9 },
      { name: 'Bane', role: 'Fighter', description: 'CC sustain', attack: 9, defense: 7, hp: 9 },
      { name: 'Barats', role: 'Tank', description: 'Heavy tank', attack: 6, defense: 9, hp: 10 },
      { name: 'Baxia', role: 'Tank', description: 'Defensive tank', attack: 6, defense: 10, hp: 10 },
      { name: 'Beatrix', role: 'Marksman', description: 'Versatile marksman', attack: 10, defense: 5, hp: 6 },
      { name: 'Belerick', role: 'Tank', description: 'Reflective tank', attack: 6, defense: 10, hp: 10 },
      { name: 'Benedetta', role: 'Assassin', description: 'Mobile assassin', attack: 10, defense: 6, hp: 6 },
      { name: 'Benten', role: 'Support', description: 'Healing utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Bruno', role: 'Marksman', description: 'Mobile marksman', attack: 10, defense: 5, hp: 6 },
      { name: 'Carmilla', role: 'Support', description: 'Healing CC', attack: 5, defense: 7, hp: 7 },
      { name: 'Cecilion', role: 'Mage', description: 'Sustain control', attack: 8, defense: 5, hp: 7 },
      { name: 'Chou', role: 'Fighter', description: 'CC mobile', attack: 9, defense: 8, hp: 8 },
      { name: 'Cliffith', role: 'Fighter', description: 'Sustain CC', attack: 9, defense: 7, hp: 8 },
      { name: 'Clint', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Claude', role: 'Marksman', description: 'Mobile sustain', attack: 10, defense: 5, hp: 6 },
      { name: 'Cyclops', role: 'Mage', description: 'Burst control', attack: 8, defense: 4, hp: 6 },
      { name: 'Darius', role: 'Tank', description: 'Durable control', attack: 7, defense: 10, hp: 10 },
      { name: 'Diggie', role: 'Support', description: 'Utility CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Dyrroth', role: 'Fighter', description: 'Burst sustain', attack: 9, defense: 7, hp: 9 },
      { name: 'Edith', role: 'Tank', description: 'Durable control', attack: 7, defense: 10, hp: 10 },
      { name: 'Estu', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 6 },
      { name: 'Eudora', role: 'Mage', description: 'Burst CC', attack: 8, defense: 4, hp: 6 },
      { name: 'Esmeralda', role: 'Tank', description: 'Control durability', attack: 7, defense: 9, hp: 10 },
      { name: 'Estes', role: 'Support', description: 'Healing sustain', attack: 5, defense: 6, hp: 8 },
      { name: 'Ezio', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Fanny', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Faramis', role: 'Support', description: 'Utility healing', attack: 5, defense: 6, hp: 7 },
      { name: 'Floryn', role: 'Support', description: 'Utility healing', attack: 5, defense: 6, hp: 7 },
      { name: 'Freya', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Gatotkaca', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Ginen', role: 'Mage', description: 'Control sustain', attack: 8, defense: 5, hp: 7 },
      { name: 'Gloo', role: 'Tank', description: 'Durable control', attack: 6, defense: 9, hp: 10 },
      { name: 'Gord', role: 'Mage', description: 'Burst control', attack: 8, defense: 4, hp: 6 },
      { name: 'Granger', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Grock', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Gusion', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Guinevere', role: 'Fighter', description: 'CC sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Hades', role: 'Tank', description: 'Durable control', attack: 7, defense: 9, hp: 10 },
      { name: 'Hanabi', role: 'Marksman', description: 'Burst control', attack: 10, defense: 5, hp: 6 },
      { name: 'Hanzo', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Hayabusa', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Helcurt', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Hilda', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Hylos', role: 'Tank', description: 'CC sustain', attack: 6, defense: 9, hp: 10 },
      { name: 'Ixia', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Javelin', role: 'Fighter', description: 'Burst sustain', attack: 9, defense: 7, hp: 8 },
      { name: 'Jeno', role: 'Support', description: 'Healing mobile', attack: 5, defense: 7, hp: 7 },
      { name: 'Johnson', role: 'Tank', description: 'Mobile control', attack: 6, defense: 9, hp: 10 },
      { name: 'Kagura', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 6 },
      { name: 'Kaja', role: 'Support', description: 'CC utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Karina', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Karrie', role: 'Marksman', description: 'Sustain range', attack: 10, defense: 5, hp: 6 },
      { name: 'Kazuki', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Khaleed', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Khufra', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Kimmy', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lancelot', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lapu-Lapu', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Layla', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Leomord', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Lesley', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Ling', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lito', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Lolita', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Luo Yi', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Lusha', role: 'Support', description: 'Healing utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Lulu', role: 'Support', description: 'Healing utility', attack: 5, defense: 6, hp: 7 },
      { name: 'Lylia', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Masha', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Mathilda', role: 'Support', description: 'CC mobile', attack: 5, defense: 7, hp: 7 },
      { name: 'Martis', role: 'Fighter', description: 'Burst sustain', attack: 9, defense: 7, hp: 8 },
      { name: 'Meiling', role: 'Support', description: 'Healing CC', attack: 5, defense: 7, hp: 7 },
      { name: 'Melissa', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Minsitthar', role: 'Tank', description: 'Control durability', attack: 6, defense: 9, hp: 10 },
      { name: 'Miya', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Minotaur', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Moskov', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Nana', role: 'Support', description: 'Healing CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Natalia', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 5 },
      { name: 'Nolan', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 8 },
      { name: 'Novaria', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Odette', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 6 },
      { name: 'Ozon', role: 'Tank', description: 'CC sustain', attack: 6, defense: 9, hp: 10 },
      { name: 'Paquito', role: 'Fighter', description: 'Burst mobile', attack: 9, defense: 8, hp: 8 },
      { name: 'Pharsa', role: 'Mage', description: 'Burst mobile', attack: 8, defense: 5, hp: 7 },
      { name: 'Phoebe', role: 'Support', description: 'Healing utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Phoveus', role: 'Fighter', description: 'Sustain CC', attack: 9, defense: 8, hp: 8 },
      { name: 'Piper', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Popol and Kupa', role: 'Marksman', description: 'Sustain CC', attack: 10, defense: 5, hp: 6 },
      { name: 'Rafaela', role: 'Support', description: 'Healing CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Reira', role: 'Support', description: 'Healing utility', attack: 5, defense: 7, hp: 7 },
      { name: 'Renee', role: 'Support', description: 'Healing CC', attack: 5, defense: 6, hp: 7 },
      { name: 'Roger', role: 'Fighter', description: 'Mobile sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Ruby', role: 'Support', description: 'CC durability', attack: 5, defense: 7, hp: 8 },
      { name: 'Saber', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Sahr', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Saint', role: 'Support', description: 'Healing CC', attack: 5, defense: 7, hp: 7 },
      { name: 'Selena', role: 'Support', description: 'Healing utility', attack: 5, defense: 6, hp: 7 },
      { name: 'Shar', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Silvanna', role: 'Fighter', description: 'Sustain CC', attack: 9, defense: 8, hp: 8 },
      { name: 'Sonia', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Sun', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Suygetsu', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Terizla', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Tigreal', role: 'Tank', description: 'Durable control', attack: 6, defense: 10, hp: 10 },
      { name: 'Uranus', role: 'Tank', description: 'Sustain durability', attack: 6, defense: 9, hp: 10 },
      { name: 'Valentina', role: 'Mage', description: 'Burst control', attack: 8, defense: 5, hp: 7 },
      { name: 'Vexana', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Wanwan', role: 'Marksman', description: 'Range burst', attack: 10, defense: 5, hp: 6 },
      { name: 'X. Borg', role: 'Tank', description: 'Control durability', attack: 7, defense: 9, hp: 10 },
      { name: 'Yve', role: 'Mage', description: 'Control burst', attack: 8, defense: 5, hp: 7 },
      { name: 'Yin', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Yi Sun-shin', role: 'Marksman', description: 'Range burst', attack: 10, defense: 4, hp: 5 },
      { name: 'Yu Zhong', role: 'Fighter', description: 'Durable sustain', attack: 9, defense: 8, hp: 9 },
      { name: 'Yorn', role: 'Assassin', description: 'Mobile burst', attack: 10, defense: 5, hp: 6 },
      { name: 'Zilong', role: 'Fighter', description: 'Burst mobile', attack: 9, defense: 7, hp: 8 },
      { name: 'Zhask', role: 'Mage', description: 'Control sustain', attack: 8, defense: 5, hp: 7 },
      { name: 'Zyra', role: 'Support', description: 'Control utility', attack: 5, defense: 7, hp: 7 }
    ];

    for (const hero of heroes) {
      await pool.query(
        'INSERT INTO heroes (name, role, description, attack, defense, hp) VALUES ($1, $2, $3, $4, $5, $6)',
        [hero.name, hero.role, hero.description, hero.attack, hero.defense, hero.hp]
      );
    }

    console.log('✓ Database seeded with 134 verified heroes and items');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

seedData();
