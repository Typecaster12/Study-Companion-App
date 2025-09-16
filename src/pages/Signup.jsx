import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing the same CSS file since styling is similar

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // In a real app, you would register the user here
      // For now, we'll just log them in directly after a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      login(name.trim());
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
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
            Create Your Account
          </motion.h1>
          
          <motion.p 
            className="apple-auth-subtitle"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Join StudyBuddy to start your personalized learning journey.
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
                className={`apple-form-input ${error && !name.trim() ? 'apple-input-error' : ''}`}
                value={name} 
                onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                placeholder="Your name" 
                autoFocus
                disabled={isSubmitting}
                aria-invalid={error && !name.trim() ? 'true' : 'false'}
              />
            </div>
            
            <div className="apple-form-group">
              <label className="apple-form-label">Email Address</label>
              <input 
                className={`apple-form-input ${error && (!email.trim() || !email.includes('@')) ? 'apple-input-error' : ''}`}
                type="email"
                value={email} 
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                placeholder="you@example.com" 
                disabled={isSubmitting}
                aria-invalid={error && (!email.trim() || !email.includes('@')) ? 'true' : 'false'}
              />
            </div>
            
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
            
            <button 
              type="submit" 
              className="apple-btn apple-btn-primary apple-auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="apple-auth-help">
              <p className="apple-auth-switch">
                Already have an account? <Link to="/login" className="apple-link">Sign in</Link>
              </p>
              <Link to="/help" className="apple-link">Need help?</Link>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;