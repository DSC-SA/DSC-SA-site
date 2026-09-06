const express = require('express');
const router = express.Router();
const { getMeta } = require('../services/metaService');

router.get('/', async (req, res) => {
  try {
    const data = await getMeta();
    const updatedAt = data.length > 0 ? data[0].updated_at : null;
    res.json({ data, updatedAt, updatedBy: data.length > 0 ? data[0].source : null });
  } catch (err) {
    console.error('[meta] error reading meta:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;