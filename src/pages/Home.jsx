/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Book Search (Open Library)
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBookSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setResults([]);
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(search)}&limit=12`);
    const data = await res.json();
    setResults(data.docs || []);
    setLoading(false);
  };

  // Persistent Study Music Player (react-youtube)
  const [musicPaused, setMusicPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
        const [player, setPlayer] = useState(null);
        const [playlistIdx, setPlaylistIdx] = useState(0);
        const playlists = [
          {
            name: 'Lofi Hip Hop',
            videoId: 'jfKfPfyJRdk',
            playlist: 'jfKfPfyJRdk',
          },
          {
            name: 'Chill Beats',
            videoId: 'DWcJFNfaw9c',
            playlist: 'DWcJFNfaw9c',
          },
          {
            name: 'Jazz Vibes',
            videoId: 'kgx4WGK0oNU',
            playlist: 'kgx4WGK0oNU',
          },
          {
            name: 'Focus Music',
            videoId: 'WPni755-Krg',
            playlist: 'WPni755-Krg',
          },
          {
            name: 'Classical Study',
            videoId: 'GRxofEmo3HA',
            playlist: 'GRxofEmo3HA',
          },
        ];

  const onReady = (event) => {
    setPlayer(event.target);
    event.target.playVideo();
  };
  const handleMusicPause = () => {
    if (player) {
      player.pauseVideo();
      setMusicPaused(true);
    }
  };
  const handleMusicPlay = () => {
    if (player) {
      player.playVideo();
      setMusicPaused(false);
    }
  };

  return (
    <>
      <div className="animated-gradient-bg"></div>
      <motion.div 
        className="home"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        <section className="hero">
          <div className="hero-content">
            <motion.div className="welcome-badge" variants={itemVariants}>
              ✨ Welcome to StudyBuddy
            </motion.div>

            <motion.h1 className="main-title" variants={itemVariants}>
              Your Personal
              <span className="highlight"> AI Study </span>
              Companion
            </motion.h1>

            <motion.p className="subtitle" variants={itemVariants}>
              Unlock your learning potential with our intelligent study companion. 
              We combine AI technology with proven learning methods to help you succeed.
            </motion.p>

            <motion.div className="cta-group" variants={itemVariants}>
              <Link to="/features" className="cta-button primary">
                Start Learning
                <span className="arrow">→</span>
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </motion.div>

            <motion.div className="quick-stats" variants={itemVariants}>
              <div className="stat-item">
                <span className="stat-value">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="hero-visual"
            variants={itemVariants}
          >
            <motion.div 
              className="floating-card main"
              animate={{
                y: [-10, 10, -10],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="card-content">
                <span className="card-icon">🎯</span>
                <div className="card-text">
                  <h3>Smart Learning Path</h3>
                  <p>Personalized for your goals</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Book Search (Open Library) */}
        <section className="book-search-section" style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '1rem', fontWeight: 600 }}>Book Search</h2>
          <form onSubmit={handleBookSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for books..."
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minWidth: '220px' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: '#4285f4', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Search</button>
          </form>
          {loading && <div style={{ margin: '1rem 0' }}>Searching...</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '900px' }}>
            {results.map(book => {
              // Check for free eBook
              const hasEbook = book.ebook_access === 'public' || book.has_fulltext;
              // Build download link if available
              let downloadUrl = '';
              if (hasEbook && book.edition_key && book.edition_key.length > 0) {
                downloadUrl = `https://openlibrary.org/books/${book.edition_key[0]}/.pdf`;
              } else if (hasEbook && book.key) {
                downloadUrl = `https://openlibrary.org${book.key}`;
              }
              return (
                <div key={book.key} style={{ width: '120px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', padding: '0.5rem' }}>
                  {book.cover_i ? (
                    <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={book.title} style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
                  ) : (
                    <div style={{ width: '100px', height: '150px', background: '#e0e0e0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Cover</div>
                  )}
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>{book.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{book.author_name ? book.author_name[0] : 'Unknown Author'}</div>
                  {hasEbook && downloadUrl ? (
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.3rem 0.7rem', background: '#4285f4', color: '#fff', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Download</a>
                  ) : (
                    <button disabled style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.3rem 0.7rem', background: '#e0e0e0', color: '#888', borderRadius: '6px', fontSize: '0.85rem', border: 'none', fontWeight: 500 }}>No eBook</button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Google Calendar Embed */}
        <section className="calendar-section" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata"
            style={{ border: 0, width: '100%', maxWidth: '800px', height: '600px', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
            title="Google Calendar"
            allowFullScreen
          ></iframe>
        </section>
      </motion.div>
    </>
  );
};

export default Home;