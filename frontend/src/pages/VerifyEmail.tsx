import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";


export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your-email@example.com";

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verificationError, setVerificationError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Demo verification code for testing: 123456
  const DEMO_CODE = "123456";

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take the last character
    setCode(newCode);
    setVerificationError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only allow 6-digit numbers
    if (!/^\d{6}$/.test(pastedData)) return;

    const newCode = pastedData.split("");
    setCode(newCode);
    setVerificationError("");

    // Focus the last input
    const lastInput = document.getElementById("code-5");
    lastInput?.focus();
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setVerificationError("Please enter the complete 6-digit code");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await axios.post("/auth/verify-email", {
        email: email,
        otp: enteredCode,
      });
      if (response.status === 200) {
        setStatus("success");
        setIsVerifying(false);
      } else {
        setVerificationError("Invalid verification code. Please try again.");
        setCode(["", "", "", "", "", ""]);
        document.getElementById("code-0")?.focus();
        setIsVerifying(false);
      }
    } catch (error: any) {
      setVerificationError(
        error.response?.data?.message ||
          "An error occurred during verification. Please try again.",
      );
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    // Demo: Simulate resending verification code
    console.log("Resending verification code to:", email);
    setResendDisabled(true);
    setCountdown(60); // 60 second cooldown
    setCode(["", "", "", "", "", ""]);
    setVerificationError("");
    document.getElementById("code-0")?.focus();
  };

  const handleBackToLogin = () => {
    toast.success("Email verified! You can now log in.");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Verification Card */}
        <div className="flex items-center justify-center">
          <div className="w-[500px] bg-white rounded-xl shadow-lg border border-neutral-200 p-4">
            {status === "pending" && (
              <>
                {/* Pending State */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <Mail className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  </div>
                  <h3 className="text-neutral-900 mb-2">Verify Your Email</h3>
                  <p className="text-neutral-600 text-sm">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-primary-600 mt-1 break-all">{email}</p>
                </div>

                {/* Code Input */}
                <div className="mb-6">
                  <label className="block text-sm text-neutral-700 mb-3 text-center">
                    Enter verification code
                  </label>
                  <div
                    className="flex gap-2 justify-center mb-2"
                    onPaste={handlePaste}
                  >
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    {verificationError && (
                      <p className="text-xs text-primary-600 text-center">
                        {verificationError}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 text-center mt-2 mb-2">
                      Demo code: 123456
                    </p>
                    {/* Verify Button */}
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying || code.join("").length !== 6}
                      className="w-3/4 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors mb-4"
                    >
                      {isVerifying ? "Verifying..." : "Verify Email"}
                    </button>
                  </div>
                </div>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendCode}
                    disabled={resendDisabled}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-neutral-900 mb-2">Email Verified!</h1>
                  <p className="text-neutral-600 text-sm mb-6">
                    Your email has been successfully verified. You can now
                    access all features of the platform.
                  </p>

                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition-colors mb-3"
                  >
                    Continue to Login
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full text-neutral-600 hover:text-neutral-900 py-2 text-sm transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 mb-2">Need help?</p>
          <p className="text-xs text-neutral-500">
            Check your spam folder or contact support if you continue to have
            issues.
          </p>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-neutral-500 text-center mt-6 px-2">
          University project for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
