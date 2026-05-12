const pool = require('../config/database');

const getAllItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY category ASC, name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItemsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = await pool.query('SELECT * FROM items WHERE category = $1 ORDER BY name ASC', [category]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadItemImage = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      console.log('❌ No file uploaded for item', id);
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📤 Uploading item image:', { itemId: id, fileName: req.file.filename });

    const imagePath = `/uploads/items/${req.file.filename}`;

    const result = await pool.query(
      'UPDATE items SET image = $1 WHERE id = $2 RETURNING *',
      [imagePath, id]
    );

    if (result.rows.length === 0) {
      console.log('❌ Item not found:', id);
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('✅ Item image uploaded successfully:', result.rows[0].name);
    res.json({ message: 'Item image uploaded successfully', image: imagePath, item: result.rows[0] });
  } catch (err) {
    console.error('❌ Item upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllItems, getItemsByCategory, uploadItemImage };
