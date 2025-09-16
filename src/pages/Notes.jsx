import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './Notes.css';

const Notes = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [notes, setNotes] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const editorRef = useRef(null);

  // Handle text formatting
  const handleFormat = (format) => {
    document.execCommand(format, false, null);
    editorRef.current.focus();
    updateButtonStates();
  };

  // Update button states based on current selection
  const updateButtonStates = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  };

  // Handle font change
  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
    document.execCommand('fontName', false, e.target.value);
    editorRef.current.focus();
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
    document.execCommand('fontSize', false, e.target.value);
    editorRef.current.focus();
  };

  // Handle download notes
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'my-notes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle editor content change
  const handleEditorChange = () => {
    setNotes(editorRef.current.innerHTML);
  };

  // OCR: Extract text from image
  const [ocrLoading, setOcrLoading] = useState(false);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    // Insert extracted text into notes
    const newNotes = editorRef.current.innerHTML + '<br>' + text;
    editorRef.current.innerHTML = newNotes;
    setNotes(newNotes);
    setOcrLoading(false);
  };
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Append transcript to notes
        const newNotes = editorRef.current.innerHTML + ' ' + transcript;
        editorRef.current.innerHTML = newNotes;
        setNotes(newNotes);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    if (isListening) {
      // Stop listening if already listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Stop mic if page/component is changed/unmounted
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };
  }, [isListening]);

  return (
    <div className="notes-container">
      <div className="notes-card">
  <div className="notes-header">
          <h1 className="notes-title">Notes</h1>
          <button
            className="mic-btn"
            onClick={handleMicClick}
            title={isListening ? "Listening..." : "Start Speech to Text"}
            // Allow pressing to stop listening
            style={{
              marginLeft: '1rem',
              background: '#fff',
              borderRadius: '50%',
              border: '1px solid #ccc',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isListening ? 'not-allowed' : 'pointer',
              outline: 'none',
              position: 'relative',
              boxShadow: '0 1px 4px rgba(60,64,67,.15)',
              transition: 'background 0.3s',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="11" y="6" width="6" height="12" rx="3" fill={isListening ? '#4285f4' : '#5f6368'} />
              <rect x="13" y="18" width="2" height="4" rx="1" fill={isListening ? '#4285f4' : '#5f6368'} />
              <path d="M8 13v1a6 6 0 0 0 12 0v-1" stroke={isListening ? '#4285f4' : '#5f6368'} strokeWidth="2" strokeLinecap="round" />
            </svg>
            {/* No glow effect, just a simple circle */}
          </button>
          <div className="formatting-tools">
            <label className="ocr-upload-label" style={{ marginRight: '1rem', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }} xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#4285f4" strokeWidth="2" />
                  <circle cx="8" cy="12" r="2" fill="#4285f4" />
                  <path d="M21 19L16 13L13 16L10 13L3 19" stroke="#4285f4" strokeWidth="2" />
                </svg>
                {ocrLoading ? 'Extracting...' : 'Image to Text'}
              </span>
            </label>
            <select 
              className="font-selector" 
              value={fontFamily} 
              onChange={handleFontChange}
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
            
            <select 
              className="font-size-selector" 
              value={fontSize} 
              onChange={handleFontSizeChange}
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
              <option value="28">28px</option>
              <option value="32">32px</option>
            </select>
            
            <div className="format-buttons">
              <button 
                className={`format-btn ${isBold ? 'active' : ''}`}
                onClick={() => handleFormat('bold')}
                title="Bold"
              >
                <strong>B</strong>
              </button>
              
              <button 
                className={`format-btn ${isItalic ? 'active' : ''}`}
                onClick={() => handleFormat('italic')}
                title="Italic"
              >
                <em>I</em>
              </button>
              
              <button 
                className={`format-btn ${isUnderline ? 'active' : ''}`}
                onClick={() => handleFormat('underline')}
                title="Underline"
              >
                <u>U</u>
              </button>
              
              <button 
                className="format-btn"
                onClick={() => handleFormat('insertUnorderedList')}
                title="Bullet List"
              >
                • List
              </button>
              
              <button 
                className="format-btn"
                onClick={() => handleFormat('insertOrderedList')}
                title="Numbered List"
              >
                1. List
              </button>
            </div>
          </div>
        </div>
        
        <div 
          ref={editorRef}
          className="notes-editor"
          contentEditable="true"
          onInput={handleEditorChange}
          onKeyUp={updateButtonStates}
          onMouseUp={updateButtonStates}
          style={{ fontFamily, fontSize: `${fontSize}px` }}
          suppressContentEditableWarning={true}
        >
          Start typing your notes here...
        </div>
        
  <div className="notes-actions">
          <button 
            className="download-btn"
            onClick={handleDownload}
            disabled={!notes.trim()}
          >
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16L12 4M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download Notes
          </button>
          
          <div className="notes-stats">
            <span>{notes.replace(/<[^>]*>/g, '').length} characters</span>
            <span>{notes.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
    
