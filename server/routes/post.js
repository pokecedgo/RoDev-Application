//Frontend access to backend

const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router
  .post('/createPost', async (req, res) => {
    try {
      const { userId, title, body, categoryId } = req.body;
      const newPost = await Post.createPost(userId, title, body, categoryId);
      res.status(201).send(newPost);
    } catch (error) {
      console.error('Create Post Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  .get('/getAllPosts', async (req, res) => {
    try {
      const posts = await Post.getAllPosts();
      res.send(posts);
    } catch (error) {
      console.error('Get All Posts Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  .get('/getPostById', async (req, res) => {
    try {
      const { postId } = req.query; 
      const post = await Post.getPostById(postId);
      res.send(post);
    } catch (error) {
      console.error('Get Post By ID Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  .put('/updatePost', async (req, res) => {
    try {
      const { postId, data } = req.body;
      const updatedPost = await Post.updatePost(postId, data);
      res.send(updatedPost);
    } catch (error) {
      console.error('Update Post Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  .delete('/deletePost', async (req, res) => {
    try {
      const { postId } = req.body;
      const deleted = await Post.deletePost(postId);
      res.send({ message: 'Post deleted', deleted });
    } catch (error) {
      console.error('Delete Post Error:', error);
      res.status(401).send({ error: error.message });
    }
  });

module.exports = router;
