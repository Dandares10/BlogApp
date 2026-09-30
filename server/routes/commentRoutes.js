const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  addComment,
  getCommentsForPost,
  deleteComment,
} = require('../controllers/commentController');

router.get('/:postId', getCommentsForPost);
router.post('/:postId', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;