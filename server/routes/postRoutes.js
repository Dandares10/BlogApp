const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  reactToPost,
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/react', protect, reactToPost);
router.delete('/:id', protect, deletePost);

module.exports = router;