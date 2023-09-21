const express = require('express');
const router = express.Router();

const { register, login, getProfile, updateProfile } = require('../controllers/user.controller')
const { authenticate } = require('../middlewares/authentication')

// Define your authentication routes (register, login, etc.)
router.post('/register', register);
router.post('/login', login);
router.get('/get-profile', authenticate, getProfile);
router.put('/edit-profile', authenticate, updateProfile);

module.exports = router;
