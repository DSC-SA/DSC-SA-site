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
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = `/uploads/items/${req.file.filename}`;

    await pool.query(
      'UPDATE items SET image = $1 WHERE id = $2',
      [imagePath, id]
    );

    res.json({ message: 'Item image uploaded successfully', image: imagePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllItems, getItemsByCategory, uploadItemImage };
