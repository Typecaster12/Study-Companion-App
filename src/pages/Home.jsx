/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
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

  return (
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
            <Link to="/register" className="cta-button primary">
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
    </motion.div>
  );
};

export default Home;