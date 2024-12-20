import React from 'react';
import { Logo } from '../components/ui/Logo';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Welcome to Bubble Book
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to create and manage your stories
        </p>

        <button
          onClick={() => console.log('Login clicked')}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 
                   text-white rounded-xl font-medium shadow-lg hover:opacity-90 
                   transition-opacity flex items-center justify-center gap-2"
        >
          Sign In
        </button>
      </motion.div>
    </div>
  );
}; 