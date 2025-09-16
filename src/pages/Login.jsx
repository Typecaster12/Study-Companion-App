import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      login(name.trim());
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="apple-auth-page">
      <div className="apple-auth-container">
        <motion.div
          className="apple-auth-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1 
            className="apple-auth-title" 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Sign in to StudyBuddy
          </motion.h1>
          
          <motion.p 
            className="apple-auth-subtitle"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Enter your name to access your personalized study dashboard.
          </motion.p>

          <motion.form 
            onSubmit={handleSubmit} 
            className="apple-auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="apple-form-group">
              <label className="apple-form-label">Display Name</label>
              <input 
                className={`apple-form-input ${error ? 'apple-input-error' : ''}`}
                value={name} 
                onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                placeholder="Your name" 
                autoFocus
                disabled={isSubmitting}
                aria-invalid={error ? 'true' : 'false'}
              />
              {error && (
                <motion.div 
                  className="apple-form-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="apple-btn apple-btn-primary apple-auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Continue'}
            </button>
            
            <div className="apple-auth-help">
              <p className="apple-auth-switch">
                Don't have an account? <Link to="/signup" className="apple-link">Sign up</Link>
              </p>
              <Link to="/help" className="apple-link">Need help?</Link>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
