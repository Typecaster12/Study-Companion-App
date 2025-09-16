/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  // Ref for scroll animations
  const ref = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      backgroundColor: "var(--primary-dark)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <>
      <motion.div 
        className="about-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        ref={ref}
      >
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        
        <div className="about-content">
          <motion.h1 
            className="about-title"
            variants={titleVariants}
          >
            About <span className="gradient-text">Study Companion</span>
          </motion.h1>
          
          <motion.div 
            className="about-section"
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="section-icon">🎯</div>
            <h2>Our Mission</h2>
            <motion.p variants={itemVariants}>
              Study Companion is designed to help students enhance their learning experience 
              through innovative tools and features that make studying more effective and enjoyable.
            </motion.p>
          </motion.div>

          <motion.div 
            className="about-section"
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="section-icon">✨</div>
            <h2>What We Offer</h2>
            <motion.ul className="features-list" variants={containerVariants}>
              {["Interactive study tools", "Progress tracking", "Personalized learning paths", 
                "Collaborative study features", "Resource management"].map((feature, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10, color: "var(--primary)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="feature-bullet"></span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div 
            className="about-section"
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="section-icon">🔮</div>
            <h2>Our Vision</h2>
            <motion.p variants={itemVariants}>
              We believe that learning should be accessible, engaging, and tailored to each 
              student's unique needs. Our platform empowers learners to achieve their academic 
              goals through technology that adapts to their learning style.
            </motion.p>
          </motion.div>

          <motion.div 
            className="about-section cta-section"
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="section-icon">🚀</div>
            <h2>Get Started</h2>
            <motion.p variants={itemVariants}>
              Ready to transform your study experience? Join thousands of students who are 
              already using Study Companion to achieve better academic results.
            </motion.p>
            <motion.button 
              className="cta-button"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Start Learning Today
              <span className="button-arrow">→</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default About;