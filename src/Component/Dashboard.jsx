import React, { useState, useMemo } from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./Dashboard.css";
import QuizDuel from "./QuizDuel"; // <-- Import the QuizDuel component

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "community", label: "Community Space" },
  { id: "games", label: "Gamified Activities" },
];

export default function StudyBuddyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="sb-dashboard">
      {/* Sidebar */}
      <motion.aside className={`sb-sidebar ${sidebarOpen ? "open" : ""}`}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sb-sidebar-top">
          <Link to="/" className="sb-brand" aria-label="Go to home">
            <div className="sb-logo" aria-hidden>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor" opacity="0.12"/>
                <path d="M3 7c0-1.1.9-2 2-2h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="7.5" cy="15.5" r="1.8" fill="currentColor" />
              </svg>
            </div>
            <div className="sb-name">StudyBuddy</div>
          </Link>

          {/* Mobile hamburger / close */}
          <button
            className="sb-mobile-toggle"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <span className="sr-only">{sidebarOpen ? "Close" : "Open"} menu</span>
            {sidebarOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>

        <nav className="sb-nav" aria-label="Main navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`sb-nav-btn ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={activeTab === item.id ? "page" : undefined}
                >
                  <span className="sb-nav-icon" aria-hidden>
                    {item.id === "home" && (
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" fill="currentColor"/></svg>
                    )}
                    {item.id === "community" && (
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a6 6 0 0 1 16 0H4z" fill="currentColor"/></svg>
                    )}
                    {item.id === "games" && (
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 10h12v4H6zM9 7v2M15 7v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    )}
                  </span>
                  <span className="sb-nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sb-sidebar-footer">
          <small>v1.0 • &nbsp;Made for students</small>
        </div>
      </motion.aside>

      <div
        className={`sb-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={sidebarOpen ? "false" : "true"}
      />

      {/* Main content */}
      <main className="sb-main" role="main">
        <motion.header className="sb-header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="sb-header-left">
            <Link to="/" className="sb-header-brand" aria-label="Go to home">
              <strong>StudyBuddy</strong>
            </Link>
            <h1 className="sb-page-title">
              {activeTab === "home" && "Home"}
              {activeTab === "community" && "Community Space"}
              {activeTab === "games" && "Gamified Activities"}
            </h1>
          </div>
          <div className="sb-header-actions">
            <div className="sb-hello">Hello, {user?.name || 'Student'} 👋</div>
          </div>
        </motion.header>

        <section className="sb-content-area">
          {activeTab === "home" && (
            <motion.div className="sb-grid" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
              <motion.div className="card" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <MoodCheckin />
              </motion.div>
              <motion.div className="card" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <ProgressWidget />
              </motion.div>
              <motion.div className="card wide" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <h3>Quick Actions</h3>
                <p className="muted">Jump into a study session, start a challenge or browse the community.</p>
                <div className="quick-actions">
                  <button className="btn-outline">Start Session</button>
                  <button className="btn-primary">Start Challenge</button>
                  <button className="btn-ghost">Browse Community</button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "community" && (
            <motion.div className="sb-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card">
                <h2>Community Space</h2>
                <p className="muted">Placeholder content — discussions, groups and study circles will appear here.</p>
              </div>
              <div className="card">
                <h3>Announcements</h3>
                <p className="muted">No announcements yet. Check back later or create one.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "games" && (
            <motion.div className="sb-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card">
                <h3>Quiz Duel</h3>
                <p className="muted">Test your knowledge against the clock. Earn badges for high scores!</p>
                <QuizDuel />
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------------------- Home view components ---------------------- */

function HomeView() {
  return (
    <div className="sb-grid">
      <div className="card">
        <MoodCheckin />
      </div>

      <div className="card">
        <ProgressWidget />
      </div>

      <div className="card wide">
        <h3>Quick Actions</h3>
        <p className="muted">Jump into a study session, start a challenge or browse the community.</p>
        <div className="quick-actions">
          <button className="btn-outline">Start Session</button>
          <button className="btn-primary">Start Challenge</button>
          <button className="btn-ghost">Browse Community</button>
        </div>
      </div>
    </div>
  );
}

function MoodCheckin() {
  const moods = useMemo(
    () => [
      { id: "bored", label: "Bored", emoji: "😴", suggestion: "Try a 10-minute puzzle to refocus." },
      { id: "curious", label: "Curious", emoji: "🤔", suggestion: "Explore a short article on something new." },
      { id: "excited", label: "Excited", emoji: "🎉", suggestion: "Great energy — start a gamified activity!" },
    ],
    []
  );
  const [selected, setSelected] = useState(moods[1]);

  return (
    <>
      <h2>Mood Check-in</h2>
      <p className="muted">How are you feeling right now? Tap an emoji to check in.</p>
      <div className="emoji-slider" role="list">
        {moods.map((m) => (
          <button
            key={m.id}
            role="listitem"
            className={`emoji-tile ${selected.id === m.id ? "selected" : ""}`}
            onClick={() => setSelected(m)}
            aria-pressed={selected.id === m.id}
          >
            <span className="emoji" aria-hidden>{m.emoji}</span>
            <span className="emoji-label">{m.label}</span>
          </button>
        ))}
      </div>
      <div className="suggestion-card">
        <p className="suggestion-text">{selected.suggestion}</p>
      </div>
    </>
  );
}

function ProgressWidget() {
  const [streak] = useState(7);
  const badges = useMemo(() => ["🏅 Consistency", "🔥 Hot Streak", "⭐ Explorer"], []);

  return (
    <>
      <h2>Progress & Motivation</h2>
      <p className="muted">Track your activity streaks and earned badges.</p>
      <div className="progress-row">
        <div className="streak-box">
          <div className="streak-value">{streak}</div>
          <div className="streak-label">Day Streak</div>
        </div>
        <div className="badges-box">
          <div className="badges-list">
            {badges.map((b, idx) => (
              <div key={idx} className="badge-pill" title={b}>
                <span className="badge-emoji">{b.split(" ")[0]}</span>
                <span className="badge-text">{b.replace(/^[^\s]+\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}