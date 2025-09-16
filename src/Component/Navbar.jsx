import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Handle scroll effect for transparent to solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`apple-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="apple-nav-container">
        {/* Logo Section */}
        <Link to="/" className="apple-nav-logo">
          <div className="apple-logo-icon">
            <svg className="studybuddy-logo" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="10" width="36" height="20" rx="4" fill="#b721ff"/>
              <rect x="8" y="16" width="24" height="8" rx="2" fill="#fff"/>
              <rect x="14" y="18" width="12" height="4" rx="1.5" fill="#21d4fd"/>
              <path d="M20 10v-4" stroke="#b721ff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="6" r="2" fill="#21d4fd"/>
            </svg>
          </div>
          <span className="apple-logo-text">StudyBuddy</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="apple-hamburger"
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <span className="hamburger-icon">☰</span>
        </button>

        {/* Navigation Links */}
        <div className={`apple-nav-links${mobileMenuOpen ? ' open' : ''}`}>
          <Link to="/about" className="apple-nav-link" tabIndex={mobileMenuOpen ? 0 : -1}>About</Link>
          <Link to="/features" className="apple-nav-link" tabIndex={mobileMenuOpen ? 0 : -1}>Features</Link>
          <Link to="/add-friend" className="apple-nav-link" tabIndex={mobileMenuOpen ? 0 : -1}>Connect</Link>
        </div>

        {/* Profile Section */}
        <div className="apple-nav-actions">
          {!user ? (
            <button className="apple-btn apple-btn-primary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          ) : (
            <>
              <button className="apple-nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}} onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <div className="apple-profile-menu">
                <button
                  className="apple-profile-button"
                  aria-label="User profile"
                  aria-haspopup="true"
                  aria-expanded={profileDropdownOpen}
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 150)}
                >
                  <div className="apple-profile-avatar">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="var(--apple-gray)"/>
                      <circle cx="16" cy="12" r="4" fill="var(--apple-gray-dark)"/>
                      <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="var(--apple-gray-dark)"/>
                    </svg>
                  </div>
                  <span className="apple-profile-name">{user.name}</span>
                </button>
                {profileDropdownOpen && (
                  <div className="apple-profile-dropdown" tabIndex={-1}>
                    <button className="apple-dropdown-item" onClick={() => { setProfileDropdownOpen(false); navigate('/dashboard'); }}>
                      My Dashboard
                    </button>
                    <button 
                      className="apple-dropdown-item apple-dropdown-signout" 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;