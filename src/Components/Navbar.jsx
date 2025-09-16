import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M8 12h16M8 16h16M8 20h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="2" fill="white"/>
              <circle cx="20" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">StudyBuddy</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/add-friend" className="nav-link">Add Friend</Link>
        </div>

        {/* Profile Section */}
        <div className="navbar-profile">
          <div className="profile-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#E5E7EB"/>
              <circle cx="16" cy="12" r="4" fill="#9CA3AF"/>
              <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#9CA3AF"/>
            </svg>
          </div>
          <span className="profile-name">Guest User</span>
          <div className="profile-dropdown-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6l4 4 4-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
