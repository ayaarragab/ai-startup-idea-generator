import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';


export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Demo: Simulate successful login
      console.log('Login successful:', formData);
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    // Demo: Simulate Google login
    console.log('Google login initiated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 px-4">
      <div className="container mx-auto max-w-xs">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      <div className="flex items-center justify-center">
        {/* Login Card */}
        <div style={{width: '500px'}} className=" bg-white rounded-xl shadow-lg border border-neutral-200 p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <h3 className="">Welcome Back</h3>
            <p className="text-neutral-600 text-sm">Sign in to continue</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors mb-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-neutral-700">Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-neutral-500">Or with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="email-ic absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-primary-500 focus:ring-primary-200'
                      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-primary-600 mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="pass-ic absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-primary-500 focus:ring-primary-200'
                      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-primary-600 mt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-200"
                />
                <span className="text-neutral-700">Remember</span>
              </label>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-xs text-neutral-600 mt-3">
            No account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
        {/* Privacy Notice */}
        <p className="text-xs text-neutral-500 text-center mt-3 px-2">
          University project for demonstration.
        </p>
      </div>
    </div>
  );
}