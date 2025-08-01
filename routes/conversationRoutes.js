const express = require('express');
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createConversation);
router.get('/', protect, getUserConversations);
router.post('/:id/messages', protect, sendMessage);
router.get('/:id/messages', protect, getMessages);

module.exports = router;
