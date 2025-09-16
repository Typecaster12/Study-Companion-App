/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import GroupChat from '../Component/GroupChat';
import './Features.css';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] // Apple-like cubic bezier
      }
    }
  };
  
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Book Search State
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

  const features = [
    { 
      key: 'pomodoro', 
      title: 'Focus Time', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
          <path d="M20 12v8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ), 
      to: '/pomodoro', 
      description: 'Achieve deep work with timed sessions and strategic breaks.',
      color: '#34c759'
    },
    { 
      key: 'notes', 
      title: 'Smart Notes', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8h20a2 2 0 012 2v20a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" />
          <path d="M14 16h12M14 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ), 
      to: '/notes', 
      description: 'Capture, organize, and retrieve ideas with powerful tools.',
      color: '#0071e3'
    },
    {
      key: 'booksearch',
      title: 'Book Search',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="24" height="16" rx="2" stroke="#4285f4" strokeWidth="2" />
          <path d="M12 20h16" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="18" r="2" fill="#4285f4" />
        </svg>
      ),
      to: null,
      description: (
        <div>
          <div style={{ marginBottom: '1rem' }}>Search for books and download free eBooks using Open Library.</div>
          <form onSubmit={handleBookSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for books..."
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minWidth: '180px' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: '#4285f4', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Search</button>
          </form>
          {loading && <div style={{ margin: '1rem 0' }}>Searching...</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '900px' }}>
            {results.map(book => {
              const hasEbook = book.ebook_access === 'public' || book.has_fulltext;
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
        </div>
      ),
      color: '#4285f4'
    },
    {
      key: 'studymusic',
      title: 'Study Music',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="16" stroke="#34c759" strokeWidth="2" />
          <path d="M16 16v8a4 4 0 1 0 2-3.464V16h6v-2h-8v2z" fill="#34c759" />
          <circle cx="24" cy="28" r="2" fill="#34c759" />
        </svg>
      ),
      to: null,
      description: (
        <div>
          <div style={{ marginBottom: '1rem' }}>Listen to lofi study music while you work. The player stays active across all pages and can be paused or resumed anytime.</div>
          <div style={{ fontSize: '0.95rem', color: '#34c759', fontWeight: 500 }}>Try it in the bottom right corner!</div>
        </div>
      ),
      color: '#34c759'
    },
    { 
      key: 'flashcards', 
      title: 'Memory Cards', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M20 16v8M16 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ), 
      to: '/flashcards', 
      description: 'Retain knowledge through scientifically-proven spaced repetition.',
      color: '#ff9f0a'
    },
    { 
      key: 'progress', 
      title: 'Insights', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 28h6v-8H8v8zM17 28h6V10h-6v18zM26 28h6v-14h-6v14z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ), 
      to: '/progress', 
      description: 'Visualize your learning journey with beautiful analytics.',
      color: '#5e5ce6'
    },
    { 
      key: 'groups', 
      title: 'Study Teams', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="28" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M24 28a8 8 0 00-16 0M24 28a8 8 0 018-8" stroke="currentColor" strokeWidth="2" />
        </svg>
      ), 
      to: '/groups', 
      description: 'Connect with peers to share knowledge and stay motivated.',
      color: '#bf5af2'
    },
    { 
      key: 'tutor', 
      title: 'AI Assistant', 
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M16 16h8M16 20h8M16 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ), 
      to: '/tutor', 
      description: 'Get personalized help and explanations whenever you need.',
      color: '#ff375f'
    }
  ];

  return (
    <motion.div 
      className="apple-features-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="apple-hero">
        <motion.h1 
          className="apple-hero-title"
          variants={heroVariants}
        >
          Tools for Success
        </motion.h1>
        <motion.p 
          className="apple-hero-subtitle"
          variants={heroVariants}
        >
          Beautifully designed features to transform how you learn and study.
        </motion.p>
      </div>
      
      <motion.div 
        className="apple-grid apple-grid-cols-3"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.key}
            className="apple-card feature-card"
            variants={featureVariants}
            onMouseEnter={() => setHoveredFeature(feature.key)}
            onMouseLeave={() => setHoveredFeature(null)}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              borderTop: `3px solid ${hoveredFeature === feature.key ? feature.color : 'transparent'}`,
              transition: 'border-color 0.3s ease'
            }}
          >
            <motion.div 
              className="apple-feature-icon"
              style={{ color: feature.color }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="apple-feature-title">{feature.title}</h3>
            <p className="apple-feature-description">{feature.description}</p>
            <div className="apple-feature-actions">
              <Link 
                className="apple-btn apple-btn-primary" 
                to={feature.to}
                style={{ backgroundColor: feature.color }}
              >
                Try {feature.title}
              </Link>
              <Link 
                className="apple-btn apple-btn-secondary" 
                to={feature.to}
                style={{ color: feature.color }}
              >
                Learn more
              </Link>
              {feature.key === 'groups' && (
                <GroupChat groupId="study-group-1" groupName="Study Teams" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Features;