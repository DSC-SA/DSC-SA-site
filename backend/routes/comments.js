const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentsController');
const { verifyToken } = require('../middleware/auth');

router.get('/:heroId', getComments);
router.post('/', verifyToken, addComment);
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;
