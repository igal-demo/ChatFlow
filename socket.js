const {validateJwt} = require('./middleware/authMiddleware');
const {saveMessage} = require('./controllers/conversationController');

const clients = new Map();

const initWs  = async(wss) => {
  wss.on('connection', async(ws, req) => {
    const conversationId = req.headers["conversation-id"];

    const status = await validateJwt(req);
    if(status.errorMessage){
      ws.close(1008, status.errorMessage);
      return;
    }
    
    ws.userId = req.user.id;
    ws.conversationId = conversationId;
    clients.set(ws.userId, conversationId);

    ws.on('message', async function incoming(message) {
      const {userId, currentConversationId} = ws
      try{
        await saveMessage(currentConversationId, userId, message);
      }catch(error){
        console.log(error);
      }

      for (const [clientId, conversationId] of clients) {
        if(clientId !== userId && currentConversationId == conversationId){
          ws.send(message);
        }
      }
    });

    ws.on('close', () => {
      clients.delete(req.user.id);
    });
  });
}

module.exports = { initWs, clients };