//Frontend access the backend

const express = require('express');
const User = require('../models/user');

const router = express.Router();

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
    .post('/register', async (req, res) => {
        try {
            const user = await User.register(req.body.username, req.body.password, req.body.email);
            res.send({ ...user, password: undefined });
        } catch (error) {
            console.error('Register error:', error.message);
            res.status(401).send({ error: error.message });
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