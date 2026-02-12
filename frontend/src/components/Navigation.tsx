import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from "../providers/AuthProvider";
import { Button } from './Button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // TODO: Replace with actual auth state management
  const { user, isAuthenticated, logout } = useAuth();
  
  const navLinks = [
    { label: 'Home', value: '/' },
    { label: 'Generate Idea', value: '/generate' },
    isAuthenticated ? { label: 'Saved Ideas', value: '/dashboard' } : null,
    { label: 'About', value: '/about' },
  ];
  
  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email' || location.pathname === '/forgot-password';
  
  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };
  
  if (isAuthPage) {
    return null;
  }
  
  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-neutral-900">AI Startup Idea Generator</div>
            </div>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link &&               <Link
                key={link.value}
                to={link.value}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-neutral-900">{user?.fullName}</span>
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-900">{user?.fullName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-t border-neutral-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link &&                 <Link
                  key={link.value}
                  to={link.value}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-left transition-colors ${
                    location.pathname === link.value
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-4 px-4 border-t border-neutral-200 pt-4">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-neutral-900">{user?.fullName}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="outlined" size="md" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      My Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="outlined" 
                    size="md" 
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outlined" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}