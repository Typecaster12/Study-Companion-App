import React, { useState, useEffect, useCallback } from "react";
import "./QuizDuel.css";

const QuizDuel = () => {
  // Sample questions
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris",
      explanation: "Paris is the capital and most populous city of France."
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: "Mars",
      explanation: "Mars appears reddish because of iron oxide (rust) on its surface."
    },
    {
      question: "Who developed the theory of relativity?",
      options: ["Newton", "Einstein", "Tesla", "Edison"],
      answer: "Einstein",
      explanation: "Albert Einstein published the theory of relativity in 1905 (special relativity) and 1915 (general relativity)."
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
      answer: "Blue Whale",
      explanation: "The blue whale is the largest animal known to have ever existed, reaching lengths of up to 100 feet."
    },
    {
      question: "Which gas do plants absorb for photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: "Carbon Dioxide",
      explanation: "Plants take in carbon dioxide and release oxygen during photosynthesis."
    },
  ];

  // State management
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('quizHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Countdown timer
  useEffect(() => {
    if (!quizStarted) return;
    
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);
  
  // Save high score when quiz finishes
  useEffect(() => {
    if (isFinished && score > highScore) {
      setHighScore(score);
      localStorage.setItem('quizHighScore', score.toString());
    }
  }, [isFinished, score, highScore]);

  // Handle option selection
  const handleSelect = (option) => {
    if (selected) return; // prevent multiple clicks
    setSelected(option);
    if (option === questions[currentQ].answer) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    setShowExplanation(true);
  };

  // Handle next question
  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setFeedback("");
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };
  
  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
  };
  
  // Restart quiz
  const restartQuiz = useCallback(() => {
    setTimeLeft(120);
    setScore(0);
    setCurrentQ(0);
    setSelected(null);
    setFeedback("");
    setIsFinished(false);
    setShowExplanation(false);
    setQuizStarted(true);
  }, []);

  // Badge awarding logic
  const getBadge = () => {
    if (score <= 2) return "🥉 Beginner Badge";
    if (score <= 4) return "🥈 Achiever Badge";
    return "🥇 Master Badge";
  };

  // Format timer
  const formatTime = (t) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        // Start Screen
        <div className="start-card animate-fade">
          <h2>Quiz Duel Challenge</h2>
          <p>Test your knowledge with 5 questions in 2 minutes!</p>
          <p className="high-score">Your High Score: <strong>{highScore}/{questions.length}</strong></p>
          <button className="start-btn" onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : !isFinished ? (
        <>
          {/* Timer & Score */}
          <div className="quiz-header">
            <div className="timer">{formatTime(timeLeft)}</div>
            <div className="score">Score: {score}</div>
          </div>

          {/* Question Area */}
          <div className="question-card animate-fade">
            <h2>{questions[currentQ].question}</h2>
            <div className="options">
              {questions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-btn 
                    ${selected === option ? "selected" : ""} 
                    ${feedback && option === questions[currentQ].answer ? "correct" : ""}
                    ${feedback && selected === option && option !== questions[currentQ].answer ? "incorrect" : ""}
                  `}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                >
                  {option}
                </button>
              ))}
            </div>
            {showExplanation && (
              <div className="explanation animate-fade">
                <p>{questions[currentQ].explanation}</p>
              </div>
            )}
            {feedback && (
              <button className="next-btn" onClick={handleNext}>
                {currentQ + 1 < questions.length ? "Next Question →" : "See Results →"}
              </button>
            )}
          </div>
        </>
      ) : (
        // Results Screen
        <div className="results-card animate-fade">
          <h2>{timeLeft <= 0 ? "⏳ Time's Up!" : "🎉 Quiz Completed!"}</h2>
          <p>
            Final Score: <strong>{score}/{questions.length}</strong>
          </p>
          {score > highScore && <p className="new-high-score">🏆 New High Score! 🏆</p>}
          <p className="badge">{getBadge()}</p>
          <button className="restart-btn" onClick={restartQuiz}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default QuizDuel;