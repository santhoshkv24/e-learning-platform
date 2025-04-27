// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Menu, Home, BookOpen, GraduationCap, LogOut, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ to, children, isMobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`${isMobile ? 'block py-2' : ''} relative text-foreground hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`}
    >
      {children}
      {isActive && (
        <motion.div 
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
          layoutId="navIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      
      // Get user info
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserRole(response.data.role);
          setUserName(response.data.name);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      className={`bg-background sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'shadow-md' : 'border-b'}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
        {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <img src='/logo.svg' width = "60"></img>
              <span className="font-semibold text-xl">Kalvista</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {isLoggedIn ? (
              <>
                <NavLink to="/">
                  Home
                </NavLink>
                
                {userRole === 'student' && (
                  <>
                    <NavLink to="/student-dashboard">
                      My Courses
                    </NavLink>
                  </>
                )}
                
                {userRole === 'instructor' && (
                  <>
                    <NavLink to="/instructor-dashboard">
                      My Courses
                    </NavLink>
                  </>
                )}
                
                <motion.div 
                  className="flex items-center space-x-4 border-l pl-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{userName}</span>
                    <span className="mx-1">·</span>
                    <span className="capitalize">{userRole}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}
                    className="flex items-center transition-all hover:bg-destructive/10 text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>

                <motion.div 
                  className="flex space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button asChild variant="outline" className="hover:bg-primary/10">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="hover:bg-primary/90 transition-colors">
                    <Link to="/register">Register</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden pt-4 pb-2 border-t mt-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NavLink to="/" isMobile>
                Home
              </NavLink>
              
              {isLoggedIn ? (
                <>
                  {userRole === 'student' && (
                    <NavLink to="/student-dashboard" isMobile>
                      My Courses
                    </NavLink>
                  )}
                  
                  {userRole === 'instructor' && (
                    <>
                      <NavLink to="/instructor-dashboard" isMobile>
                        My Courses
                      </NavLink>
                      <NavLink to="/instructor-dashboard/create" isMobile>
                        Create Course
                      </NavLink>
                    </>
                  )}
                  
                  <div className="py-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{userName}</span>
                    <span className="mx-1">·</span>
                    <span className="capitalize">{userRole}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start hover:bg-destructive/10 text-foreground">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/courses" isMobile>
                    Courses
                  </NavLink>
                  <div className="flex flex-col space-y-2 mt-2">
                    <Button asChild variant="outline" className="hover:bg-primary/10">
            <Link to="/login">Login</Link>
          </Button>
                    <Button asChild className="hover:bg-primary/90 transition-colors">
            <Link to="/register">Register</Link>
          </Button>
        </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
