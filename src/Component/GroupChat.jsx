import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import './GroupChat.css';

const GroupChat = ({ groupId = 'default', groupName = 'Study Group' }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(user ? user.name : localStorage.getItem('chat_username') || 'User' + Math.floor(Math.random() * 1000));
  const [isConnected, setIsConnected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Update username when user changes
  useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
      localStorage.setItem('chat_username', user.name);
    }
  }, [user]);
  
  // Save username to localStorage when manually changed
  useEffect(() => {
    if (username && !user) {
      localStorage.setItem('chat_username', username);
    }
  }, [username, user]);

  // Connect to socket server
  useEffect(() => {
    let isMounted = true;
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      // Get the current hostname (works for both localhost and network IP)
      const host = window.location.hostname;
      const newSocket = io(`http://${host}:3000`, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });
      
      socketRef.current = newSocket;
      
      if (isMounted) setSocket(newSocket);

      newSocket.on('connect', () => {
        if (isMounted) {
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionError('');
          console.log('Connected to socket server');
          // Join the group room
          newSocket.emit('join_group', groupId);
        }
      });

      newSocket.on('connect_error', (err) => {
        if (isMounted) {
          console.error('Connection error:', err);
          setIsConnecting(false);
          setConnectionError('Failed to connect to chat server');
        }
      });

      newSocket.on('disconnect', () => {
        if (isMounted) {
          setIsConnected(false);
          console.log('Disconnected from socket server');
        }
      });

      newSocket.on('receive_message', (data) => {
        if (isMounted && data) {
          setMessages((prevMessages) => {
            // Check if we already have this message (to avoid duplicates)
            if (data.id && prevMessages.some(msg => msg.id === data.id)) {
              return prevMessages;
            }
            return [...prevMessages, {
              ...data,
              timestamp: data.timestamp || new Date().toISOString()
            }];
          });
        }
      });
      
      newSocket.on('message_history', (history) => {
        if (isMounted && Array.isArray(history)) {
          console.log('Received message history:', history.length, 'messages');
          setMessages(history);
        }
      });
      
      newSocket.on('user_joined', (data) => {
        if (isMounted) {
          setActiveUsers(prev => new Set([...prev, data.id]));
          // Add system message
          setMessages(prevMessages => [
            ...prevMessages, 
            {
              id: `system-${Date.now()}`,
              sender: 'System',
              message: 'A new user has joined the chat',
              timestamp: data.timestamp || new Date().toISOString(),
              isSystem: true
            }
          ]);
        }
      });
      
      newSocket.on('user_left', (data) => {
        if (isMounted) {
          setActiveUsers(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(data.id);
            return newSet;
          });
          // Add system message
          setMessages(prevMessages => [
            ...prevMessages, 
            {
              id: `system-${Date.now()}`,
              sender: 'System',
              message: 'A user has left the chat',
              timestamp: data.timestamp || new Date().toISOString(),
              isSystem: true
            }
          ]);
        }
      });
      
      newSocket.on('error', (data) => {
        if (isMounted && data && data.message) {
          setConnectionError(data.message);
        }
      });

      return () => {
        isMounted = false;
        if (newSocket) {
          newSocket.emit('leave_group', groupId);
          newSocket.disconnect();
          socketRef.current = null;
        }
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      if (isMounted) {
        setIsConnecting(false);
        setConnectionError('Failed to initialize chat connection');
      }
      return () => { isMounted = false; };
    }
  }, [groupId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !isConnected || !username.trim()) return;
    
    try {
      setIsSending(true);
      
      // Create message object with timestamp
      const messageData = {
        groupId,
        sender: username.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Generate a temporary local ID for optimistic UI update
      const localId = `local-${Date.now()}`;
      
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, {
        ...messageData,
        id: localId,
        pending: true
      }]);
      
      // Clear input field
      setMessage('');
      
      // Send to server
      socket.emit('group_message', messageData, (acknowledgement) => {
        setIsSending(false);
        
        // If we get an error back, we could handle it here
        if (acknowledgement && acknowledgement.error) {
          console.error('Error sending message:', acknowledgement.error);
          setConnectionError('Failed to send message. Please try again.');
          
          // Remove the pending message
          setMessages(prev => prev.filter(msg => msg.id !== localId));
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError('Failed to send message. Please try again.');
      setIsSending(false);
    }
  }, [message, socket, isConnected, username, groupId]);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
    
    // If opening chat and we have connection error, try to reconnect
    if (!isChatOpen && connectionError && socket) {
      socket.connect();
      setIsConnecting(true);
      setConnectionError('');
    }
  }, [isChatOpen, connectionError, socket]);

  return (
    <div className="group-chat-container">
      <button 
        className={`chat-toggle-btn ${isChatOpen ? 'active' : ''}`} 
        onClick={toggleChat}
      >
        {isChatOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>{groupName} Chat</h3>
            <div className="header-right">
              <div className="active-users-count">
                {activeUsers.size} online
              </div>
              <div className={`connection-status ${isConnected ? 'connected' : isConnecting ? 'connecting' : connectionError ? 'connection-error' : 'disconnected'}`}>
                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : connectionError ? 'Error' : 'Disconnected'}
              </div>
            </div>
          </div>
          
          <div className="messages-container">
            {connectionError ? (
              <div className="connection-error">{connectionError}</div>
            ) : messages.length === 0 ? (
              <div className="no-messages">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={`message ${msg.sender === username ? 'own-message' : 'other-message'} ${
                    msg.isSystem ? 'system-message' : ''
                  } ${msg.pending ? 'pending-message' : ''}`}
                >
                  <div className="message-sender">{msg.sender}</div>
                  <div className="message-content">{msg.message}</div>
                  <div className="message-timestamp">
                    {msg.timestamp ? 
                      new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                      ''}
                    {msg.pending && <span className="pending-indicator"> (sending...)</span>}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="message-form" onSubmit={handleSendMessage}>
            {!user && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="username-input"
                maxLength={30}
                disabled={isSending}
              />
            )}
            <div className="message-input-container">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
                className="message-input"
                disabled={!isConnected || isSending}
                maxLength={500}
                aria-label="Message input"
              />
              <button 
                type="submit" 
                className="send-button" 
                disabled={!isConnected || !message.trim() || isSending}
                aria-label="Send message"
              >
                {isSending ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupChat;