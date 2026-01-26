import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './providers/AuthProvider';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { Home } from './pages/Home';
import { Generate } from './pages/Generate';
import { IdeaDetail } from './pages/IdeaDetail';
import { Dashboard } from './pages/Dashboard';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ToastContainer } from 'react-toastify'

type PageType = 'home' | 'generate' | 'idea-detail' | 'dashboard' | 'how-it-works' | 'research' | 'about';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/generate" element={<PageTransition><Generate /></PageTransition>} />
        <Route path="/idea/:id" element={<PageTransition><IdeaDetail /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [generationData, setGenerationData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as PageType);
    if (data) {
      setGenerationData(data);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}