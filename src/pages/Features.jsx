/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import './Features.css';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    { title: 'AI Study Plans', color: '#4F46E5', icon: '🎯' },
    { title: 'Progress Tracking', color: '#10B981', icon: '📊' },
    { title: 'Smart Reminders', color: '#F59E0B', icon: '⏰' },
    { title: 'Study Groups', color: '#EF4444', icon: '👥' },
    { title: 'AI Tutor', color: '#8B5CF6', icon: '🤖' },
    { title: 'Gamification', color: '#06B6D4', icon: '🎮' }
  ];

  return (
    <motion.div 
      className="features-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="features-title"
        variants={featureVariants}
      >
        Features
      </motion.h1>
      <motion.p 
        className="features-subtitle"
        variants={featureVariants}
      >
        Discover the powerful features that make StudyBuddy the ultimate learning companion.
      </motion.p>
      
      <motion.div 
        className="features-grid"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            variants={featureVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{ '--feature-color': feature.color }}
          >
            <motion.span 
              className="feature-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {feature.icon}
            </motion.span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Features;