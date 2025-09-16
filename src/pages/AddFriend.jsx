/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import './AddFriend.css';

const AddFriend = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
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
      className="add-friend-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="page-title"
        variants={itemVariants}
      >
        Add Friends
      </motion.h1>
      <motion.p 
        className="page-description"
        variants={itemVariants}
      >
        Connect with fellow learners and build your study network for collaborative learning experiences.
      </motion.p>
      
      <div className="content-wrapper">
        <motion.div 
          className="card"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="card-title">Search for Friends</h3>
          <motion.input 
            type="text" 
            placeholder="Search by username or email" 
            className="search-input"
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button 
            className="search-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="card"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="card-title">Friend Requests</h3>
          <p className="empty-state">No pending friend requests at the moment.</p>
        </motion.div>
        
        <motion.div 
          className="card"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="card-title">Suggested Friends</h3>
          <p className="empty-state">Based on your study interests and goals, we'll suggest potential study buddies here.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddFriend;