require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Route imports
const userRoutes = require('./server/routes/user');
const postRoutes = require('./server/routes/post');
const categoryRoutes = require('./server/routes/category');
const commentRoutes = require('./server/routes/comment');

// MongoDB connection
mongoose.connect(process.env.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully!'))
.catch(error => console.error('❌ MongoDB connection error:', error));

// Middleware (had issues with CORS)
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// Debug middleware - confirms requests are hitting server
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path} | Body:`, req.body);
    next();
});

// Routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);
app.use('/comment', commentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
