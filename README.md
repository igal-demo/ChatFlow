✅ Backend with Node.js, Express, MongoDB (in-memory), JWT, and WebSocket
✅ REST APIs for auth, users, conversations, and messages
✅ Real-time messaging via WebSocket
✅ Simple frontend with HTML/CSS/JS


🔐 Authentication APIs (/auth)
Method	Endpoint	Description
POST	/auth/register	Register a new user with email and password. Returns a JWT token.
POST	/auth/login	Log in an existing user. Returns a JWT token.

👤 User APIs (/users)
Method	Endpoint	Description
GET	/users/me	Get the current authenticated user's profile (email). Requires JWT.
GET	/users	Get a list of all users in the system. Requires JWT.

💬 Conversation APIs (/conversations)
Method	Endpoint	Description
GET	/conversations	Get all conversations for the current user. Sorted by lastModified desc.
POST	/conversations	Start a new conversation with selected participants. Requires at least 1.
GET	/conversations/:id/messages	Get all messages in a conversation, sorted by timestamp ascending.
POST	/conversations/:id/messages	Add a new message to a conversation. Updates lastModified. Broadcasts via WebSocket.