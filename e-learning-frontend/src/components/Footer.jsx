// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Github
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="container mx-auto">
        {/* Top wave decoration */}
        <div className="h-4 bg-gradient-to-r from-primary via-primary/70 to-primary/30 rounded-b-3xl"></div>
        
        <div className="px-6 py-6">
          {/* Two column layout */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            {/* Left side - Logo and tagline */}
            <div className="flex flex-col">
              <motion.div
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <img src='/logo2.svg' width = "60"></img>
                <span className="font-bold text-xl">Kalvista</span>
              </motion.div>
              
              <p className="text-gray-400 text-sm max-w-md">
                A modern platform for online education, where knowledge meets technology.
              </p>
            </div>
            
            {/* Right side - Social links */}
            <div className="flex mt-4 md:mt-0">
              <a href="https://github.com/santhoshkv24/kalvista-elearning-platform" target="_blank"  className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors mx-2">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=santhoshvedakrishnan@gmail.com" 
  target="_blank" className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors mx-2">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* About Us - Centered at bottom */}
          <div className="flex justify-center">
            <Link 
              to="/aboutus" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-gray-950 py-3">
        <div className="container mx-auto px-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Kalvista Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
