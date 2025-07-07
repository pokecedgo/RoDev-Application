//Frontend access the backend

const express = require('express');
const cors = require('cors'); // Import cors
const User = require('../models/user');
const userController = require('../controllers/userController');

const router = express.Router();

// Debug middleware - add this to see if requests are reaching the server
router.use((req, res, next) => {
  console.log('User route accessed:', req.method, req.path, req.body);
  next();
});

router
    .post('/login', async (req, res) => {
        try {
            const user = await User.login(req.body.username, req.body.password);
            res.send({ ...user, password: undefined });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).send({ error: error.message });
        }
    })
    // Registration route - make sure there's no auth middleware here
    .post('/register', (req, res, next) => {
        console.log('Registration request received:', req.body);
        next();
    }, async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = await User.register(username, password, email);
            res.status(200).json({ 
                success: true, 
                user: { 
                    username: user.username,
                    email: user.email
                } 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    })
    //Password Update Case 1: User wants to change  (Logged in State)
    .put('/update', async (req, res) => {
        try {
            const user = await User.updatePassword(req.body.id, req.body.password);
            res.send({ ...user, password: undefined });
        } catch (error) {
            res.status(401).send({ error: error.message });
        }
    })
    //Password Update Case 2: User forgot password (Logged out State)
    .put('/update-by-email', async (req, res) => {
        try {
            const user = await User.updatePasswordByEmail(req.body.email, req.body.newPassword);
            res.send({ ...user, password: undefined });
        } catch (error) {
            res.status(401).send({ error: error.message });
        }
    })
    .delete('/delete', async (req, res) => {
        try {
            const user = await User.deleteUser(req.body.id);
            res.send({ message: 'Account deleted successfully', user: { ...user, password: undefined } });
        } catch (error) {
            res.status(401).send({ error: error.message });
        }
    });

module.exports = router;