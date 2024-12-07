import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = ({ activeTabLabel }) => {
  return (
    <motion.h1
      className="text-4xl font-bold mb-8 text-[#febe03] text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {activeTabLabel}
    </motion.h1>
  );
};

export default DashboardHeader;