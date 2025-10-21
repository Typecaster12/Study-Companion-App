import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import './Chatbot.css';

// API endpoints
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'qwen3:8b';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Available Groq models
const GROQ_MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', description: 'Fast responses, good for quick queries' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', description: 'More powerful, better reasoning' }
];

/**
 * Calls the Groq API with the provided chat history.
 * @param {Object} param0 - The request object containing messages and model.
 * @returns {Promise<Object>} - The AI's response message object.
 */
const fetchGroqChat = async ({ messages, model }) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured. Please set REACT_APP_GROQ_API_KEY environment variable.');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }

    return data.choices[0].message;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
};

/**
 * Calls the Ollama API with the provided chat history.
 * @param {Object} param0 - The request object containing messages.
 * @returns {Promise<Object>} - The AI's response message object.
 */
const fetchOllamaChat = async ({ messages }) => {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error response:', errorText);
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.message) {
      throw new Error('Invalid response format from Ollama API');
    }

    return data.message;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI study assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');
  const [useLocalModel, setUseLocalModel] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (messageData) => {
      if (useLocalModel) {
        return await fetchOllamaChat(messageData);
      } else {
        return await fetchGroqChat(messageData);
      }
    },
    onSuccess: (responseMessage) => {
      setMessages(prev => [...prev, responseMessage]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      }]);
    }
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage = { role: 'user', content: inputMessage.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Prepare messages for API (include system prompt for context)
    const messagesForAPI = [
      {
        role: 'system',
        content: 'You are a helpful AI study assistant. Help students with their learning, provide explanations, answer questions, and offer study tips. Be encouraging and supportive.'
      },
      ...messages,
      userMessage
    ];

    chatMutation.mutate({ messages: messagesForAPI, model: selectedModel });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        <svg className="chatbot-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.05 1.05 4.42L2 22l5.58-1.05C8.95 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
        </svg>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Study Assistant</h3>
            <button
              className="chatbot-close"
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-settings">
            <div className="model-selector">
              <label>
                <input
                  type="checkbox"
                  checked={useLocalModel}
                  onChange={(e) => setUseLocalModel(e.target.checked)}
                />
                Use Local Model (Ollama)
              </label>
            </div>

            {!useLocalModel && (
              <div className="model-selector">
                <label htmlFor="model-select">AI Model:</label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {GROQ_MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your studies..."
              disabled={chatMutation.isPending}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="chatbot-send"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
