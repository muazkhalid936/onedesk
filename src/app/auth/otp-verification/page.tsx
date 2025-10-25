"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { verify_otp, request_otp_again } from "@/api/auth";

interface ApiError {
  success: false;
  errors: {
    detail?: string[];
    email?: string[];
    otp?: string[];
    message: string;
  };
}

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    general?: string;
  }>({});
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get email from session storage (set during signup)
    const storedEmail = sessionStorage.getItem("signup_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: undefined }));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      return false;
    }
    return true;
  };

  const handleRequestOtp = async () => {
    setErrors({});

    if (!validateEmail()) {
      return;
    }

    setIsResending(true);

    try {
      await request_otp_again({ email });
      sessionStorage.setItem("signup_email", email);
      toast.success("Verification code sent! Check your email.");
      setResendTimer(60); // 60 second cooldown
    } catch (error: unknown) {
      console.error("Request OTP error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail()) {
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }

    setIsVerifying(true);

    try {
      await verify_otp({ email, otp: otpString });
      sessionStorage.removeItem("signup_email");
      toast.success("Email verified successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error: unknown) {
      console.error("OTP verification error:", error);

      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as ApiError;
        const newErrors: { email?: string; otp?: string; general?: string } =
          {};

        if (apiError.errors) {
          if (apiError.errors.email && apiError.errors.email.length > 0) {
            newErrors.email = apiError.errors.email[0];
          }
          if (apiError.errors.otp && apiError.errors.otp.length > 0) {
            newErrors.otp = apiError.errors.otp[0];
          }
          if (apiError.errors.detail && apiError.errors.detail.length > 0) {
            newErrors.general = apiError.errors.detail[0];
          }
        }

        setErrors(newErrors);

        if (newErrors.general) {
          toast.error(newErrors.general);
        }
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OneDesk</h1>
          <p className="text-sm text-gray-500 mt-1">Email Verification</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and the 6-digit code we sent you
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {errors.general && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-full aspect-square text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.otp
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-white"
                    } ${digit ? "border-blue-500" : ""}`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.otp}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Didn&apos;t receive the code?
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isResending || resendTimer > 0}
                className="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all duration-200"
              >
                {isResending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : resendTimer > 0 ? (
                  `Resend code in ${resendTimer}s`
                ) : (
                  "Send new code"
                )}
              </button>

              <div className="text-center text-sm text-gray-600">
                Back to{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don&apos;t see the email
          </p>
        </div>
      </div>
    </div>
  );
}
