const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');

// Create a new conversation
const createConversation = async (req, res) => {
  const userId = req.user.id;
  let participantIds = req.body.participantIds;
  //Filter out current user fron list of participants
  participantIds = participantIds.filter(participantId => participantId !== userId);

  if (!participantIds) {
    return res.status(400).json({ message: 'At least one participant required' });
  }

  //Ensure all participants exist
  const foundParticipant = await User.find({ _id: { $in: participantIds}})
  if(foundParticipant.length != participantIds.length){
    return res.status(400).json({ message: 'Not all participants exist' });
  }
  
  //Add current user to participants list
  foundParticipant.push(req.user);
  participantIds.push(userId);

  const displayName = foundParticipant.map(user=> user.displayName).sort().join(", ");

  try {
    // Generate a hash to identify unique participant combinations
    const participantHash = participantIds.sort().join('-');

    // Check if a conversation with the same participants already exists
    const existing = await Conversation.findOne({ participantHash });
    if (existing) {
      return res.status(200).json(existing);
    }

    const conversation = await Conversation.create({
      participants: participantIds,
      participantHash,
      displayName: displayName,
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate('participants', 'displayName email');

    res.json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  const conversationId = req.params.id;
  const { content } = req.body;
  const senderId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const message = await saveMessage(conversationId, senderId, content);
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const saveMessage = async (conversationId, senderId, content) => {
  // Ensure conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    return message;
}

const getMessages = async (req, res) => {
  const conversationId = req.params.id;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // oldest to newest
      .populate('senderId', 'displayName email');

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  saveMessage
};
