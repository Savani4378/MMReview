import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const SuccessScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl shadow-xl shadow-purple-900/5 max-w-md mx-auto my-12"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Thank You! 💜
      </h2>
      
      <p className="text-lg text-gray-700 mb-2">
        Your feedback means a lot to us.
      </p>
      
      <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
        Your experience helps us create better events and a stronger community.
      </p>
      
      <div className="px-6 py-3 bg-purple-50 text-purple-700 rounded-full font-medium text-sm">
        See you at the next Meet Mosaic event! 🧩
      </div>
    </motion.div>
  );
};
