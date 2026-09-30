const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content, summary, coverImage, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      summary,
      coverImage,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      author: req.userId,
    });
    const populated = await post.populate('author', 'username email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { search, tag, author } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag && tag !== 'All') {
      query.tags = { $in: [tag] };
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email')
      .populate('likes', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, summary, coverImage, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (summary !== undefined) post.summary = summary;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    }

    await post.save();
    const updated = await post.populate('author', 'username email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likedIndex = post.likes.indexOf(req.userId);
    if (likedIndex === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();
    const updated = await post.populate('author', 'username email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const reactToPost = async (req, res) => {
  try {
    const { type } = req.body;
    const validTypes = ['inspiring', 'relatable', 'well_said', 'mind_blown'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.reactions) post.reactions = [];

    const existingIndex = post.reactions.findIndex(
      (r) => r.user.toString() === req.userId && r.type === type
    );

    if (existingIndex !== -1) {
      // Remove reaction if already toggled on
      post.reactions.splice(existingIndex, 1);
    } else {
      // Remove previous reaction by same user if any, then add new one
      post.reactions = post.reactions.filter((r) => r.user.toString() !== req.userId);
      post.reactions.push({ user: req.userId, type });
    }

    await post.save();
    const updated = await post.populate('author', 'username email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost, reactToPost };