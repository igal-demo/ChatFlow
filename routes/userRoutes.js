const express = require('express');
const { getAllUsers, getUserById, getCurrentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllUsers);
router.get('/me', protect, getCurrentUser);
router.get('/:id', protect, getUserById);

module.exports = router;
