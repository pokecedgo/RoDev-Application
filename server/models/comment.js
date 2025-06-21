const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

//CRUD Functions
// Create a comment
async function createComment(postId, userId, body) {
  return await Comment.create({ postId, userId, body });
}

// Get comment by postId
async function getCommentsByPostId(postId) {
  return await Comment.find({ postId }).populate('userId').populate('postId');
}

// Update 
async function updateComment(commentId, body) {
  return await Comment.findByIdAndUpdate(commentId, { body }, { new: true });
}

// Delete 
async function deleteComment(commentId) {
  return await Comment.findByIdAndDelete(commentId);
}

module.exports = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment
};
