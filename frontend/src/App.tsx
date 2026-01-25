import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}