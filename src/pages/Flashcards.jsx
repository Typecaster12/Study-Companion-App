import { useState, useEffect } from 'react';
import './Flashcards.css';

const initial = [
  { q: 'What is the Study Companion App?', a: 'A web application designed to help students learn efficiently using AI-powered tools.' },
  { q: 'Which frontend library powers the app?', a: 'React.' },
  { q: 'What is Vite used for in this project?', a: 'Vite is the build tool and dev server for fast development and hot module replacement.' },
  { q: 'How does the Pomodoro feature help users?', a: 'It enables focused study sessions with timed work and break intervals.' },
  { q: 'What is the purpose of the Notes feature?', a: 'To let users take, format, and download study notes.' },
  { q: 'How does the Flashcards feature work?', a: 'It presents questions and answers for self-testing, with shuffle and progress tracking.' },
  { q: 'What does the Chatbot do?', a: 'It answers questions, provides study tips, and helps with learning.' },
  { q: 'How is Google Calendar integrated?', a: 'It is embedded on the Home page for scheduling and viewing events.' },
  { q: 'What is the Navbar used for?', a: 'Navigation between app sections and features.' },
  { q: 'How does the app support accessibility?', a: 'By using semantic HTML, keyboard navigation, and accessible color contrast.' },
  { q: 'What is glassmorphism in CSS?', a: 'A design style using frosted glass effects, transparency, and blur.' },
  { q: 'How can users format text in Notes?', a: 'With bold, italic, underline, lists, font family, and font size options.' },
  { q: 'How does speech-to-text work in Notes?', a: 'It uses the Web Speech API to convert spoken words to text.' },
  { q: 'What is the role of framer-motion?', a: 'It adds smooth animations and transitions to UI elements.' },
  { q: 'How are flashcards shuffled?', a: 'Using the Fisher-Yates algorithm for random order.' },
  { q: 'What is the use of useState in React?', a: 'To manage local component state.' },
  { q: 'What is useEffect used for?', a: 'To handle side effects like data fetching and event listeners.' },
  { q: 'How does the app handle keyboard navigation?', a: 'Arrow keys and spacebar flip and navigate flashcards.' },
  { q: 'How can users download their notes?', a: 'By clicking the download button, which saves notes as a text file.' },
  { q: 'What is the benefit of using context in React?', a: 'It allows sharing state across components without prop drilling.' },
  { q: 'How does the app ensure responsive design?', a: 'Using CSS flexbox, media queries, and scalable layouts.' },
  { q: 'What is the role of AppLayout?', a: 'It provides consistent structure and layout for all pages.' },
  { q: 'How does the Quiz Duel feature work?', a: 'It allows users to compete in quizzes for learning and fun.' },
  { q: 'What is the Group Chat feature?', a: 'A space for collaborative study and communication.' },
  { q: 'How does the Footer enhance usability?', a: 'It provides quick links and information at the bottom of the app.' },
  { q: 'What is the use of useRef in Notes?', a: 'To access and manipulate the editable notes DOM element.' },
  { q: 'How does the app use localStorage?', a: 'To persist user data and preferences.' },
  { q: 'What is the role of the About page?', a: 'To explain the app’s features and mission.' },
  { q: 'How does the Help page assist users?', a: 'It provides guidance and answers to common questions.' },
  { q: 'What is the Add Friend feature?', a: 'Allows users to connect and collaborate with others.' },
  { q: 'How does the Signup/Login flow work?', a: 'It authenticates users and manages access to features.' },
  { q: 'What is the Features page for?', a: 'Showcases all the app’s capabilities and tools.' },
  { q: 'How does the app use SVGs?', a: 'For crisp, scalable icons and graphics.' },
  { q: 'What is the use of ESLint?', a: 'To enforce code quality and consistency.' },
  { q: 'How does the app handle errors?', a: 'With error boundaries and user-friendly messages.' },
  { q: 'What is the use of vite.config.js?', a: 'To configure Vite’s build and dev server settings.' },
  { q: 'How does the app support dark mode?', a: 'With theme CSS and user toggles.' },
  { q: 'What is the use of App.css?', a: 'Global styles for the app’s layout and appearance.' },
  { q: 'How does the app use assets?', a: 'For images, icons, and other static files.' },
  { q: 'What is the role of Dashboard?', a: 'Displays user progress and study stats.' },
  { q: 'How does the app use animation?', a: 'For engaging transitions and feedback.' },
  { q: 'What is the use of context/AuthContext.jsx?', a: 'Manages authentication state across the app.' },
  { q: 'How does the app use CSS modules?', a: 'For scoped, maintainable styles.' },
  { q: 'What is the use of vite.svg and react.svg?', a: 'Branding and visual identity.' },
  { q: 'How does the app support mobile devices?', a: 'With responsive layouts and touch-friendly controls.' },
  { q: 'What is the use of QuizDuel.css?', a: 'Styles for the Quiz Duel feature.' },
  { q: 'How does the app use accessibility roles?', a: 'To improve navigation for screen readers.' },
  { q: 'What is the use of framer-motion in Navbar?', a: 'For animated menu transitions.' },
  { q: 'How does the app use download icons?', a: 'To visually indicate downloadable content.' },
  { q: 'What is the use of AppLayout.css?', a: 'Layout and style for the main app structure.' },
  { q: 'How does the app use theme.css?', a: 'For color schemes and theming.' },
  { q: 'What is the use of apple-theme.css?', a: 'Provides an Apple-inspired theme option.' },
  // ...add more real questions up to 500
];

const Flashcards = () => {
  const [cards, setCards] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') setFlipped(f => !f);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + cards.length) % cards.length); };
  const shuffle = () => {
    let arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setCards(arr);
    setIdx(0);
    setFlipped(false);
    setShuffled(true);
  };
  const reset = () => {
    setCards(initial);
    setIdx(0);
    setFlipped(false);
    setShuffled(false);
  };

  return (
    <div className="page">
      <div className="page-container flashcards-container">
        <h1 className="page-title">Flashcards</h1>
        <div className={`card flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
          <div className="face front">{cards[idx].q}</div>
          <div className="face back">{cards[idx].a}</div>
        </div>
        <div className="progress-indicator">Card {idx + 1} of {cards.length}</div>
        <div className="controls">
          <button className="btn-outline" onClick={prev}>Prev</button>
          <button className="btn-primary" onClick={next}>Next</button>
          <button className="btn-outline" onClick={shuffle}>{shuffled ? 'Shuffled!' : 'Shuffle'}</button>
          <button className="btn-outline" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
