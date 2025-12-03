// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', userController.getUsers);

// POST /api/users/register
router.post('/register', userController.registerUser);

module.exports = router;
