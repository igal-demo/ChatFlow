require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { startMongo } = require('./config/mongoMemory');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const authRoutes = require('./routes/authRoutes');
const {validateJwt} = require('./middleware/authMiddleware')
const {initWs} = require('./socket');

const app = express();
app.use(express.json());
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
initWs(wss);

// Routes
app.use('/users', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT;
startMongo().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});