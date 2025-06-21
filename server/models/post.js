const mongoose = require('mongoose');

require('./category');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    //for our forums, categoryId will be like the category so "Building", "Resource", "Modeling", etc.
    //I would do postType however, users can technically have a post with a mix of images and text and videos
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);


//CRUD Functions
// Creating post
async function createPost(userId, title, body, categoryId) {
    return await Post.create({ userId, title, body, categoryId });
}

// Reading post
async function getAllPosts() {
    return await Post.find().populate('userId').populate('categoryId');
}

async function getPostById(postId) {
    return await Post.findById(postId).populate('userId').populate('categoryId');
}

// Updating post
async function updatePost(postId, data) {
    return await Post.findByIdAndUpdate(postId, data, { new: true });
}

// Deleting post
async function deletePost(postId) {
    return await Post.findByIdAndDelete(postId);
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
