const express = require('express');
const router = express.Router();
const { getAllMatches, createMatch, deleteMatch } = require('../controllers/matchesController');

// Get all matches
router.get('/', getAllMatches);

// Create match (no auth required for admin)
router.post('/', createMatch);

// Delete match
router.delete('/:matchId', deleteMatch);

module.exports = router;
