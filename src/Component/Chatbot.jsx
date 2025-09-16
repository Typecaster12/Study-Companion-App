import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import './Chatbot.css';

// API endpoints
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'qwen3:8b';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = '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';

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

    return {
      role: 'assistant',
      content: data.choices[0].message.content || 'No response content from Groq'
    };
  } catch (error) {
    console.error('Groq API fetch error:', error);
    throw error;
  }
};

/**
 * Calls the local Ollama API with the provided chat history, using streaming.
 * @param {Object} param0 - The request object containing messages.
 * @param {Function} onStream - Callback to update the streamed reply and optional think text.
 * @returns {Promise<Object>} - The AI's response message object.
 */
const fetchOllamaChatStream = async ({ messages, onStream }) => {
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.body) throw new Error('No response body from Ollama');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let fullText = '';

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          const token = data.message?.content || '';
          if (token) {
            fullText += token;
            // Split think and visible parts
            const thinkMatch = fullText.match(/<think>[\s\S]*?<\/think>/i);
            const thinkText = thinkMatch ? (thinkMatch[0].replace(/<\/?think>/gi, '').trim()) : '';
            const visible = thinkMatch ? fullText.replace(/<think>[\s\S]*?<\/think>/ig, '').trimStart() : fullText;
            onStream({ visibleText: visible, thinkText });
          }
        } catch (err) {
          // ignore partial JSON lines
        }
      }
    }
  }
  // Final split
  const finalThink = (fullText.match(/<think>[\s\S]*?<\/think>/i)?.[0] || '').replace(/<\/?think>/gi, '').trim();
  const finalVisible = fullText.replace(/<think>[\s\S]*?<\/think>/ig, '').trimStart();
  return { role: 'assistant', content: finalVisible, think: finalThink };
};

const Chatbot = () => {
  // Voice Assistant (Speech-to-Text)
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => {
        const newInput = prev + (prev ? ' ' : '') + transcript;
        // Automatically send the message using direct function call
        setTimeout(() => {
          if (newInput.trim()) {
            // Simulate form submit
            handleSend({ preventDefault: () => {} });
          }
        }, 100);
        return newInput;
      });
      setListening(false);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = () => setListening(false);
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };
  const [open, setOpen] = useState(false);
  const [popupExpanded, setPopupExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your Study Companion AI. Ask me anything about your studies!' }
  ]);
  const [streamingReply, setStreamingReply] = useState('');
  const [streamingThink, setStreamingThink] = useState('');
  const [showStreamingThink, setShowStreamingThink] = useState(true);
  const [expandedMap, setExpandedMap] = useState({}); // key: index, value: boolean
  const [currentModel, setCurrentModel] = useState('groq'); // 'ollama' or 'groq'
  const [selectedGroqModel, setSelectedGroqModel] = useState('llama-3.1-8b-instant');
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, streamingReply, streamingThink]);

  const ollamaMutation = useMutation({
    mutationFn: async ({ messages }) => {
      return fetchOllamaChatStream({
        messages,
        onStream: ({ visibleText, thinkText }) => {
          setStreamingReply(visibleText);
          setStreamingThink(thinkText);
          setShowStreamingThink(!!thinkText);
        },
      });
    },
    onSuccess: (aiMessage) => {
      setMessages((prev) => [...prev, aiMessage]);
      setStreamingReply('');
      setStreamingThink('');
      setShowStreamingThink(false);
    },
    onError: (error) => {
      setStreamingReply('');
      setStreamingThink('');
      setShowStreamingThink(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not get a response from Ollama. Please try again.' }
      ]);
      console.error('Ollama API error:', error?.response?.data || error.message || error);
    },
  });

  const groqMutation = useMutation({
    mutationFn: async ({ messages }) => {
      return fetchGroqChat({ messages, model: selectedGroqModel });
    },
    onSuccess: (aiMessage) => {
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: (error) => {
      let errorMessage = 'Sorry, I could not get a response from Groq. Please try again.';
      
      if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please check the Groq API key.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid request format. Please try rephrasing your message.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Groq server error. Please try again later.';
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMessage }
      ]);
      console.error('Groq API error:', error);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || ollamaMutation.isLoading || groqMutation.isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);

    if (currentModel === 'ollama') {
      ollamaMutation.mutate({ messages: [...messages, userMessage] });
    } else {
      groqMutation.mutate({ messages: [...messages, userMessage] });
    }
  };
  
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([{ role: 'assistant', content: 'Hi! I am your Study Companion AI. Ask me anything about your studies!' }]);
      localStorage.removeItem('chatHistory');
    }
  };

  const toggleModel = () => {
    setCurrentModel(prev => prev === 'ollama' ? 'groq' : 'ollama');
  };

  const toggleExpand = (idx) => {
    setExpandedMap((m) => ({ ...m, [idx]: !m[idx] }));
  };

  const closeStreamingThink = () => setShowStreamingThink(false);
  const closeStoredThink = (idx) => {
    setMessages((prev) => prev.map((m, i) => i === idx ? { ...m, think: undefined } : m));
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${open ? 'open' : ''} ${messages.length > 1 ? 'has-messages' : ''}`} 
        onClick={() => setOpen(!open)}
        aria-label="Toggle chatbot"
      >
        <div className="chatbot-icon">
          {open ? '×' : '💬'}
        </div>
        {!open && messages.length > 1 && <span className="chatbot-badge">{messages.length - 1}</span>}
      </button>
      
      <div className={`chatbot-popup ${open ? 'open' : ''} ${popupExpanded ? 'expanded' : ''}`}>
        <div className="chatbot-header">
          <h3>Study Companion AI</h3>
          <div className="chatbot-controls">
            <div className="model-selector">
              <select 
                value={currentModel} 
                onChange={(e) => setCurrentModel(e.target.value)}
                disabled={ollamaMutation.isLoading || groqMutation.isLoading}
                aria-label="Select AI model"
              >
                <option value="ollama">Ollama (local)</option>
                <option value="groq">Groq (cloud)</option>
              </select>
              {currentModel === 'groq' && (
                <select
                  value={selectedGroqModel}
                  onChange={(e) => setSelectedGroqModel(e.target.value)}
                  disabled={ollamaMutation.isLoading || groqMutation.isLoading}
                  aria-label="Select Groq model"
                >
                  {GROQ_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              )}
            </div>
            <button 
              className="clear-chat-btn" 
              onClick={clearChat}
              disabled={(ollamaMutation.isLoading || groqMutation.isLoading) || messages.length <= 1}
              aria-label="Clear chat history"
            >
              Clear
            </button>
          </div>
        </div>
        
        {error && (
          <div className="chatbot-error">
            <p>{error}</p>
          </div>
        )}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.role}`}>
              {msg.role === 'assistant' && msg.think && (
                <div className="think-bubble">
                  <div className="think-header">
                    <span>Model thoughts</span>
                    <button className="think-close" onClick={() => closeStoredThink(idx)}>Hide</button>
                  </div>
                  <div className="think-content">{msg.think}</div>
                </div>
              )}
              <div className={`bubble${expandedMap[idx] ? ' expanded' : ''}`}>
                {msg.content}
                {msg.role === 'assistant' && (
                  <div className="bubble-actions">
                    <button className="expand-btn" onClick={() => toggleExpand(idx)}>{expandedMap[idx] ? 'Shrink' : 'Expand'}</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(ollamaMutation.isLoading || groqMutation.isLoading) && streamingThink && showStreamingThink && (
            <div className="chatbot-message assistant">
              <div className="think-bubble">
                <div className="think-header">
                  <span>Model thoughts</span>
                  <button className="think-close" onClick={closeStreamingThink}>Hide</button>
                </div>
                <div className="think-content">{streamingThink}</div>
              </div>
            </div>
          )}
          {streamingReply && (
            <div className="chatbot-message assistant">
              <div className="bubble expanded">{streamingReply}<span className="blinking-cursor">|</span></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="chatbot-input-area" onSubmit={handleSend}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={ollamaMutation.isLoading || groqMutation.isLoading}
              autoFocus={open}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={listening || ollamaMutation.isLoading || groqMutation.isLoading}
              style={{
                background: listening ? '#34c759' : '#eee',
                color: listening ? '#fff' : '#333',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.2rem',
                cursor: listening ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              title={listening ? 'Listening...' : 'Voice input'}
            >
              🎤
            </button>
            <button
              type="submit"
              disabled={ollamaMutation.isLoading || groqMutation.isLoading || !input.trim()}
              style={{
                background: '#34c759',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.5rem 1.1rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Send
            </button>
          </div>
        </form>
        <button className="popup-expand-btn" onClick={() => setPopupExpanded((v) => !v)}>{popupExpanded ? 'Shrink' : 'Expand'}</button>
      </div>
    </>
  );
};

export default Chatbot;
