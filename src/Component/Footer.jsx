import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="var(--apple-black)"/>
                  <path d="M16 6c-2.2 0-4 1.8-4 4 0 2 1.5 3.6 3.5 3.9.2-1.2.9-2.2 1.8-2.9-.3-.6-.8-1-1.3-1-1.7 0-1.7 2.3 0 2.3.5 0 .9-.2 1.2-.6.4.4.7.9.8 1.5 1.6-.4 2.8-1.9 2.8-3.6.1-2-1.6-3.6-3.8-3.6z" fill="white"/>
                  <path d="M20.5 14h-9c-1.4 0-2.5 1.1-2.5 2.5v7c0 1.4 1.1 2.5 2.5 2.5h9c1.4 0 2.5-1.1 2.5-2.5v-7c0-1.4-1.1-2.5-2.5-2.5zm-4.5 9c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="white"/>
                </svg>
              </div>
              <span className="footer-logo-text">StudyBuddy</span>
            </div>
            <p className="footer-description">
              Beautifully designed learning tools with AI-powered features to help you study smarter, not harder.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#api">API Docs</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#support">Customer Support</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#status">System Status</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#report">Report Bug</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="apple-footer-bottom">
          <div className="apple-footer-bottom-content">
            <p className="apple-copyright">
              Copyright © {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
            <div className="apple-footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Use</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;