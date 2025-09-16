import { motion } from 'framer-motion';
import './Help.css';

const Help = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="apple-help-page">
      <div className="apple-help-container">
        <motion.div
          className="apple-help-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 className="apple-help-title" variants={itemVariants}>
            Help & Support
          </motion.h1>

          <motion.div className="apple-help-section" variants={itemVariants}>
            <h2>Getting Started</h2>
            <div className="apple-help-card">
              <h3>Creating an Account</h3>
              <p>
                To create a new StudyBuddy account, click the "Sign up" button on the login page. 
                Enter your name and email address to get started.
              </p>
              <div className="apple-help-steps">
                <div className="apple-help-step">
                  <div className="apple-help-step-number">1</div>
                  <div className="apple-help-step-content">
                    Navigate to the Sign up page
                  </div>
                </div>
                <div className="apple-help-step">
                  <div className="apple-help-step-number">2</div>
                  <div className="apple-help-step-content">
                    Enter your display name and email
                  </div>
                </div>
                <div className="apple-help-step">
                  <div className="apple-help-step-number">3</div>
                  <div className="apple-help-step-content">
                    Click "Create Account" to complete registration
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="apple-help-section" variants={itemVariants}>
            <h2>Account Management</h2>
            <div className="apple-help-card">
              <h3>Signing In</h3>
              <p>
                If you already have an account, enter your display name on the login page 
                to access your dashboard and personalized study materials.
              </p>
            </div>

            <div className="apple-help-card">
              <h3>Password Reset</h3>
              <p>
                If you've forgotten your password, click the "Need help?" link on the login page 
                and follow the instructions to reset your password.
              </p>
            </div>
          </motion.div>

          <motion.div className="apple-help-section" variants={itemVariants}>
            <h2>Using StudyBuddy</h2>
            <div className="apple-help-card">
              <h3>Dashboard</h3>
              <p>
                Your dashboard provides an overview of your study progress, upcoming tasks, 
                and personalized recommendations based on your learning patterns.
              </p>
            </div>

            <div className="apple-help-card">
              <h3>Study Tools</h3>
              <p>
                StudyBuddy offers various tools to enhance your learning experience:
              </p>
              <ul className="apple-help-list">
                <li>Pomodoro Timer for focused study sessions</li>
                <li>Notes for capturing important information</li>
                <li>Flashcards for effective memorization</li>
                <li>AI-powered chat assistant for instant help</li>
              </ul>
            </div>
          </motion.div>

          <motion.div className="apple-help-section" variants={itemVariants}>
            <h2>Contact Support</h2>
            <div className="apple-help-card">
              <p>
                If you need additional assistance, our support team is here to help.
              </p>
              <div className="apple-help-contact">
                <div className="apple-help-contact-item">
                  <div className="apple-help-contact-icon">✉️</div>
                  <div className="apple-help-contact-info">
                    <h4>Email Support</h4>
                    <p>support@studybuddy.com</p>
                  </div>
                </div>
                <div className="apple-help-contact-item">
                  <div className="apple-help-contact-icon">💬</div>
                  <div className="apple-help-contact-info">
                    <h4>Live Chat</h4>
                    <p>Available 24/7 through the chat icon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;