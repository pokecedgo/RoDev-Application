// Frontend access to backend

const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();

console.log("Comment exports:", Comment);

router
  // Create a new comment
  .post('/createComment', async (req, res) => {
    try {
      const { postId, userId, body } = req.body;
      const newComment = await Comment.createComment(postId, userId, body);
      res.status(201).send(newComment);
    } catch (error) {
      console.error('Create Comment Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  // Get all comments for a specific post
  .get('/getCommentsByPostId', async (req, res) => {
    try {
      const { postId } = req.query;
      const comments = await Comment.getCommentsByPostId(postId);
      res.send(comments);
    } catch (error) {
      console.error('Get Comments Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  // Update comment content
  .put('/updateComment', async (req, res) => {
    try {
      const { commentId, body } = req.body;
      const updated = await Comment.updateComment(commentId, body);
      res.send(updated);
    } catch (error) {
      console.error('Update Comment Error:', error);
      res.status(401).send({ error: error.message });
    }
  })

  // Delete a comment
  .delete('/deleteComment', async (req, res) => {
    try {
      const { commentId } = req.body;
      const deleted = await Comment.deleteComment(commentId);
      res.send({ message: 'Comment deleted', deleted });
    } catch (error) {
      console.error('Delete Comment Error:', error);
      res.status(401).send({ error: error.message });
    }
  });

module.exports = router;
