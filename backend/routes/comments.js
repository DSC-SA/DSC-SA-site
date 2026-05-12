const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment, likeComment, addReply } = require('../controllers/commentsController');
const { verifyToken } = require('../middleware/auth');

router.get('/:heroId', getComments);
router.post('/', verifyToken, addComment);
router.post('/:commentId/like', verifyToken, likeComment);
router.post('/:commentId/reply', verifyToken, addReply);
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;
