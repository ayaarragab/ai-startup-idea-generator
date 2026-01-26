import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Demo verification code for testing: 123456
  const DEMO_CODE = '123456';

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('/auth/forget-password', { email });
      if (res.status === 200) {
        setStep('code');
        setIsSubmitting(false);   
      } else {
        toast.error(res?.data?.error || 'Failed to send reset code. Please try again later.');
        setIsSubmitting(false); 
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to send reset code. Please try again later.');
      setIsSubmitting(false); 
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setCodeError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`reset-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (!/^\d{6}$/.test(pastedData)) return;
    
    const newCode = pastedData.split('');
    setCode(newCode);
    setCodeError('');
    
    const lastInput = document.getElementById('reset-code-5');
    lastInput?.focus();
  };

  const handleCodeSubmit = async () => {
    const enteredCode = code.join('');
    
    if (enteredCode.length !== 6) {
      setCodeError('Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('/auth/verify-otp-forget-password', { email, otp: enteredCode });
      if (res.status === 200) {
        toast.success('Verification successful');
        setStep('reset');
        setIsSubmitting(false);   
      } else {
        toast.error(res.data?.error || 'Invalid verification code. Please try again.');
        setCodeError(res.data?.error || 'Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        document.getElementById('reset-code-0')?.focus();
        setIsSubmitting(false); 
      }
    } catch (error: any) {
      setCodeError(error?.response?.data?.error || 'Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('reset-code-0')?.focus();
      setIsSubmitting(false); 
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post('/auth/reset-password', { email, password });
      if (res.status === 200) {
        toast.success('Password reset successful');
        setStep('success');
        setIsSubmitting(false);   
      } else {
        toast.error(res?.data?.error || 'Failed to reset password. Please try again later.');
        setIsSubmitting(false); 
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to reset password. Please try again later.');
      setIsSubmitting(false); 
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    try {
      const res = await axios.post('/auth/forget-password', { email });
      if (res.status === 200) {
        toast.success('Verification code resent successfully');
        setResendDisabled(true);
        setCountdown(60);
        setCode(['', '', '', '', '', '']);
        setCodeError('');
        document.getElementById('reset-code-0')?.focus();
      } else {
        toast.error(res?.data?.error || 'Failed to resend code. Please try again later.');
        setCode(['', '', '', '', '', '']);
        setCodeError('');
        document.getElementById('reset-code-0')?.focus();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to resend code. Please try again later.');
      setCode(['', '', '', '', '', '']);
      setCodeError('');
      document.getElementById('reset-code-0')?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 px-4">
      <div className="container mx-auto max-w-[500px]">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        {/* Card */}
        <div className='flex items-center justify-center'>
          <div className="w-[500px] bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-neutral-900 mb-2">Forgot Password?</h3>
                <p className="text-neutral-600 text-sm">
                  No worries! Enter your email and we'll send you a reset code.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3/4 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      placeholder="email@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        emailError
                          ? 'border-primary-500 focus:ring-primary-200'
                          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs text-primary-600 mt-1">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Sending Code...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Verify Code */}
          {step === 'code' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-neutral-900 mb-2">Check Your Email</h3>
                <p className="text-neutral-600 text-sm">
                  We've sent a 6-digit code to
                </p>
                <p className="text-primary-600 mt-1 break-all">{email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-neutral-700 mb-3 text-center">
                  Enter verification code
                </label>
                <div className="flex gap-2 justify-center mb-2" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                  ))}
                </div>
                {codeError && (
                  <p className="text-xs text-primary-600 text-center">{codeError}</p>
                )}
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Demo code: 123456
                </p>
              </div>
                <div className='flex flex-col justify-center items-center'>
                  <button
                      onClick={handleCodeSubmit}
                      disabled={isSubmitting || code.join('').length !== 6}
                      className="w-3/4 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors mb-4"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify Code'}
                    </button>
                </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-neutral-900 mb-2">Set New Password</h3>
                <p className="text-neutral-600 text-sm">
                  Choose a strong password for your account
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm text-neutral-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-primary-500 focus:ring-primary-200'
                        : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-neutral-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-primary-500 focus:ring-primary-200'
                        : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                  />
                  {passwordError && (
                    <p className="text-xs text-primary-600 mt-1">{passwordError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-neutral-900 mb-2">Password Reset!</h3>
                <p className="text-neutral-600 text-sm mb-6">
                  Your password has been successfully reset. You can now login with your new password.
                </p>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition-colors mb-3"
                >
                  Continue to Login
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full text-neutral-600 hover:text-neutral-900 py-2 text-sm transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </>
          )}
          </div>
        </div>
        {/* Privacy Notice */}
        <p className="text-xs text-neutral-500 text-center mt-6 px-2">
          University project for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
