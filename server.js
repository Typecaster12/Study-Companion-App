import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();
const httpServer = createServer(app);

// Configure CORS for Express
app.use(cors());

// Configure Socket.io with CORS and additional options
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow connections from any origin
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
  pingTimeout: 20000,
  pingInterval: 25000
});

// Store active users and messages (in-memory storage)
const activeGroups = new Map();
const messageHistory = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join a study group room
  socket.on("join_group", (groupId) => {
    try {
      if (!groupId) {
        groupId = 'default';
      }
      
      const roomName = `group_${groupId}`;
      socket.join(roomName);
      
      // Track active users in group
      if (!activeGroups.has(roomName)) {
        activeGroups.set(roomName, new Set());
      }
      activeGroups.get(roomName).add(socket.id);
      
      // Send recent message history to new user
      if (messageHistory.has(roomName)) {
        const recentMessages = messageHistory.get(roomName);
        if (recentMessages.length > 0) {
          socket.emit('message_history', recentMessages);
        }
      } else {
        messageHistory.set(roomName, []);
      }
      
      console.log(`User ${socket.id} joined group ${groupId}`);
      
      // Notify group about new user
      socket.to(roomName).emit('user_joined', { id: socket.id, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error(`Error in join_group: ${error.message}`);
      socket.emit('error', { message: 'Failed to join group chat' });
    }
  });
  
  // Leave a study group room
  socket.on("leave_group", (groupId) => {
    try {
      if (!groupId) return;
      
      const roomName = `group_${groupId}`;
      socket.leave(roomName);
      
      // Remove user from active users in group
      if (activeGroups.has(roomName)) {
        activeGroups.get(roomName).delete(socket.id);
      }
      
      console.log(`User ${socket.id} left group ${groupId}`);
      
      // Notify group about user leaving
      socket.to(roomName).emit('user_left', { id: socket.id, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error(`Error in leave_group: ${error.message}`);
    }
  });
  
  // Handle group chat messages
  socket.on("group_message", (data) => {
    try {
      if (!data || !data.groupId || !data.message) {
        socket.emit('error', { message: 'Invalid message format' });
        return;
      }
      
      const roomName = `group_${data.groupId}`;
      const messageId = randomUUID();
      const timestamp = data.timestamp || new Date().toISOString();
      
      const messageData = {
        id: messageId,
        sender: data.sender || 'Anonymous',
        message: data.message.slice(0, 500), // Limit message length
        timestamp: timestamp
      };
      
      console.log(`Message in group ${data.groupId}: ${data.message.slice(0, 50)}${data.message.length > 50 ? '...' : ''}`);
      
      // Store message in history (limit to 50 most recent)
      if (messageHistory.has(roomName)) {
        const messages = messageHistory.get(roomName);
        messages.push(messageData);
        
        // Keep only the 50 most recent messages
        if (messages.length > 50) {
          messageHistory.set(roomName, messages.slice(-50));
        }
      }
      
      // Broadcast to room
      io.to(roomName).emit("receive_message", messageData);
    } catch (error) {
      console.error(`Error in group_message: ${error.message}`);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove user from all active groups
    for (const [roomName, users] of activeGroups.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        // Extract groupId from roomName (remove 'group_' prefix)
        const groupId = roomName.substring(6);
        socket.to(roomName).emit('user_left', { id: socket.id, timestamp: new Date().toISOString() });
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from other devices using your network IP address and port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});